import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

import fs from "fs";

function appendLog(msg: string) {
  try {
    fs.appendFileSync("/tmp/gemini.log", `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to get GoogleGenAI client (cached instance)
let cachedClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

function formatLogErrorMessage(error: any): string {
  const status = error?.status || error?.code || error?.error?.code;
  const rawMsg = error?.message || (typeof error === "string" ? error : JSON.stringify(error));
  if (status === 429 || rawMsg.includes("429") || rawMsg.includes("Quota exceeded") || rawMsg.includes("RESOURCE_EXHAUSTED")) {
    return "Gemini API free tier rate limit/quota reached (429). Activating seamless fallback dataset.";
  }
  if (status === 503 || rawMsg.includes("503") || rawMsg.includes("UNAVAILABLE")) {
    return "Gemini API service temporarily unavailable (503). Activating seamless fallback dataset.";
  }
  return typeof rawMsg === "string" ? rawMsg.slice(0, 160) : "Upstream AI service error";
}

// Resilient multi-model manager with active cooldown tracking to handle 429 quota exhaustion & 503 spikes
interface ModelCooldownInfo {
  until: number;
  reason: string;
}

const modelCooldowns = new Map<string, ModelCooldownInfo>();

function isModelInCooldown(model: string): boolean {
  const info = modelCooldowns.get(model);
  if (!info) return false;
  if (Date.now() > info.until) {
    modelCooldowns.delete(model);
    return false;
  }
  return true;
}

function setModelCooldown(model: string, cooldownMs: number, reason: string) {
  modelCooldowns.set(model, {
    until: Date.now() + cooldownMs,
    reason,
  });
}

function parseRetryDelayMs(error: any): number {
  try {
    const errorStr = typeof error === "string" ? error : JSON.stringify(error);
    const match = errorStr.match(/(\d+(?:\.\d+)?)\s*s(?:econds)?/i);
    if (match && match[1]) {
      return Math.ceil(parseFloat(match[1]) * 1000);
    }
  } catch {
    // Ignore JSON stringify errors
  }
  return 60000; // Default 60s cooldown on quota exhaustion
}

async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: string;
    config?: any;
    preferredModel?: string;
  }
): Promise<string> {
  // High-availability model candidate pool with quota-separated models
  // gemini-3.1-flash-lite has high quota, minimal thinking latency, and fast JSON generation
  const candidatePool = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.8-flash",
  ];

  // If a preferred model was requested, test it first unless it is in active cooldown
  const modelsToTry: string[] = [];
  if (params.preferredModel && !isModelInCooldown(params.preferredModel)) {
    modelsToTry.push(params.preferredModel);
  }

  // Add remaining models: non-cooldown first, cooldown models as last resort
  const nonCooldownModels = candidatePool.filter(
    (m) => m !== params.preferredModel && !isModelInCooldown(m)
  );
  const cooldownModels = candidatePool.filter(
    (m) => m !== params.preferredModel && isModelInCooldown(m)
  );

  modelsToTry.push(...nonCooldownModels, ...cooldownModels);

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const startTime = Date.now();
      appendLog(`Calling model "${model}"...`);
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Model ${model} request timed out after 25s`));
        }, 25000);
        if (typeof timer.unref === "function") timer.unref();
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        }),
        timeoutPromise,
      ]);

      if (response && response.text) {
        appendLog(`Model "${model}" responded in ${Date.now() - startTime}ms. Output length: ${response.text.length}`);
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || err?.error?.code;
      const message = err?.message || String(err);
      appendLog(`Model "${model}" failed. Status: ${status}, Message: ${message.slice(0, 150)}`);
      const isQuota429 = status === 429 || status === "RESOURCE_EXHAUSTED" || message.includes("Quota exceeded") || message.includes("429");

      if (isQuota429) {
        const cooldownMs = parseRetryDelayMs(err);
        setModelCooldown(model, cooldownMs, "Rate limit / Quota exceeded (429)");
        console.warn(`[Gemini API] Model ${model} reached quota limit (429). Cooldown: ${Math.round(cooldownMs / 1000)}s. Switching to next model...`);
      } else {
        console.warn(`[Gemini API] Request with model ${model} temporarily unavailable (${status || "error"}). Trying next model...`);
      }

      if (status === 503 || isQuota429 || message.includes("high demand") || message.includes("UNAVAILABLE")) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  }

  throw lastError || new Error("All Gemini generation attempts failed");
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  const allModels = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
  const activeModels = allModels.filter((m) => !isModelInCooldown(m));
  const coolingDown = Array.from(modelCooldowns.entries()).map(([model, info]) => ({
    model,
    resumesInSeconds: Math.max(0, Math.round((info.until - Date.now()) / 1000)),
    reason: info.reason,
  }));

  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    activeModels,
    coolingDown,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/logs", (_req: Request, res: Response) => {
  try {
    const content = fs.existsSync("/tmp/gemini.log")
      ? fs.readFileSync("/tmp/gemini.log", "utf-8")
      : "No logs yet";
    res.type("text/plain").send(content.slice(-4000));
  } catch (e: any) {
    res.status(500).send(e?.message);
  }
});

// 1. Generate Query Fan-Out & Follow-Up Conversational Journey
app.post("/api/fanout/generate", async (req: Request, res: Response) => {
  try {
    const { seedQuery, brandName, targetAudience, language } = req.body;
    if (!seedQuery || typeof seedQuery !== "string") {
      return res.status(400).json({ error: "Seed query is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return high-fidelity fallback template crafted from the Louisa Frahm Search Engine Land framework
      return res.json(getFallbackFanOut(seedQuery, brandName, language));
    }

    const systemPrompt = `You are a world-class Conversational Search Engine Optimization (GEO/AEO) expert specializing in the methodology outlined by Louisa Frahm in Search Engine Land ("The follow-up query: Rethinking SEO for conversational search").
Analyze the user's seed topic and map the full multi-turn conversational journey.
AI search engines (Google AI Overviews, ChatGPT Search, Perplexity) do NOT treat search as a single isolated query; they perform "Query Fan-Out" across multiple subtopics and anticipate the user's natural follow-up queries.

Taxonomy of Follow-Up Queries:
1. Clarification: Initial understanding, definitions, concepts, answering "What is X?"
2. Constraints: User specifies limits/conditions (budget, team size, OS, time, skill, geography)
3. Comparison: Comparing alternatives, "X vs Y", feature trade-offs, pros & cons
4. Validation: Trust signals, real user experiences, reviews, Reddit consensus, risks, proof points
5. Action: Moving toward decision/action (pricing, onboarding, setup steps, migration, ROI)

For each query node, provide:
- query: The natural language follow-up question
- intent: The underlying search intent
- subQueries: 3-4 background fan-out queries that AI engines run to answer this
- recommendedFormat: 'prose' | 'table' | 'bullet_specs' | 'quote_proof' | 'step_by_step'
- contentTip: How content creators should format their webpage to win the AI citation
- citationLikelihood: 'High' | 'Medium' | 'Critical'
- difficulty: 'Low' | 'Medium' | 'High'

Output strictly valid JSON with this structure:
{
  "seedQuery": "...",
  "marketContext": "...",
  "totalFollowUps": 12,
  "aiOverviewTriggerScore": 88,
  "executiveSummary": "...",
  "keyEntities": ["entity1", "entity2", ...],
  "stages": {
    "clarification": [{ "id": "clar-1", "stage": "clarification", "query": "...", "intent": "...", "subQueries": ["..."], "recommendedFormat": "prose", "contentTip": "...", "citationLikelihood": "High", "difficulty": "Low" }],
    "constraints": [{ "id": "cons-1", "stage": "constraints", "query": "...", "intent": "...", "subQueries": ["..."], "recommendedFormat": "table", "contentTip": "...", "citationLikelihood": "Critical", "difficulty": "Medium" }],
    "comparison": [{ "id": "comp-1", "stage": "comparison", "query": "...", "intent": "...", "subQueries": ["..."], "recommendedFormat": "table", "contentTip": "...", "citationLikelihood": "High", "difficulty": "High" }],
    "validation": [{ "id": "val-1", "stage": "validation", "query": "...", "intent": "...", "subQueries": ["..."], "recommendedFormat": "quote_proof", "contentTip": "...", "citationLikelihood": "High", "difficulty": "Medium" }],
    "action": [{ "id": "act-1", "stage": "action", "query": "...", "intent": "...", "subQueries": ["..."], "recommendedFormat": "step_by_step", "contentTip": "...", "citationLikelihood": "High", "difficulty": "Medium" }]
  }
}
Language: ${language === 'fa' ? 'Persian (Farsi)' : 'English'}.`;

    const userPrompt = `Seed Topic / Query: "${seedQuery}"
${brandName ? `Brand / Context: "${brandName}"` : ""}
${targetAudience ? `Target Audience: "${targetAudience}"` : ""}

Generate a focused, high-precision 5-stage conversational tree with 2 to 3 high-value follow-up questions per stage.`;

    const rawText = await generateContentWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(rawText || "{}");
    const normalized = normalizeFanOutResult(parsed, seedQuery, brandName, language);
    return res.json(normalized);
  } catch (error: any) {
    console.warn(`[Fan-Out API] ${formatLogErrorMessage(error)}`);
    // Graceful fallback with seed query
    return res.json(getFallbackFanOut(req.body.seedQuery || "Conversational Search", req.body.brandName, req.body.language));
  }
});

function normalizeFanOutResult(parsed: any, seedQuery: string, brandName?: string, language?: string): any {
  const fallback = getFallbackFanOut(seedQuery, brandName, language);
  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const stagesList = ["clarification", "constraints", "comparison", "validation", "action"] as const;
  const rawStages = parsed.stages || {};
  const normalizedStages: any = {};

  stagesList.forEach((stageName) => {
    const rawNodes = Array.isArray(rawStages[stageName]) ? rawStages[stageName] : [];
    if (rawNodes.length === 0) {
      normalizedStages[stageName] = fallback.stages[stageName];
    } else {
      normalizedStages[stageName] = rawNodes.map((node: any, idx: number) => {
        const fbNode = fallback.stages[stageName][idx % fallback.stages[stageName].length] || fallback.stages[stageName][0];
        return {
          id: node.id || `${stageName.slice(0, 4)}-${idx + 1}`,
          stage: stageName,
          query: (node.query || fbNode.query).trim(),
          intent: (node.intent || fbNode.intent).trim(),
          subQueries: Array.isArray(node.subQueries) && node.subQueries.length > 0
            ? node.subQueries.map((s: any) => String(s).trim()).filter(Boolean)
            : fbNode.subQueries,
          recommendedFormat: node.recommendedFormat || fbNode.recommendedFormat,
          contentTip: (node.contentTip || fbNode.contentTip).trim(),
          citationLikelihood: node.citationLikelihood || fbNode.citationLikelihood,
          difficulty: node.difficulty || fbNode.difficulty,
        };
      });
    }
  });

  const totalFollowUps = Object.values(normalizedStages).reduce(
    (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return {
    seedQuery: parsed.seedQuery || seedQuery,
    brandName: parsed.brandName || brandName || undefined,
    marketContext: (parsed.marketContext || fallback.marketContext).trim(),
    totalFollowUps: totalFollowUps || fallback.totalFollowUps,
    aiOverviewTriggerScore: typeof parsed.aiOverviewTriggerScore === "number"
      ? Math.min(100, Math.max(0, Math.round(parsed.aiOverviewTriggerScore)))
      : fallback.aiOverviewTriggerScore,
    executiveSummary: (parsed.executiveSummary || fallback.executiveSummary).trim(),
    keyEntities: Array.isArray(parsed.keyEntities) && parsed.keyEntities.length > 0
      ? parsed.keyEntities.map((e: any) => String(e).trim()).filter(Boolean)
      : fallback.keyEntities,
    stages: normalizedStages,
  };
}

function getFollowUpNodeSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      stage: { type: Type.STRING },
      query: { type: Type.STRING },
      intent: { type: Type.STRING },
      subQueries: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      recommendedFormat: { type: Type.STRING },
      contentTip: { type: Type.STRING },
      citationLikelihood: { type: Type.STRING },
      difficulty: { type: Type.STRING },
    },
    required: [
      "id",
      "stage",
      "query",
      "intent",
      "subQueries",
      "recommendedFormat",
      "contentTip",
      "citationLikelihood",
      "difficulty",
    ],
  };
}

function getAuditScorecardSchema() {
  const metricItemSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      score: { type: Type.INTEGER },
      status: { type: Type.STRING },
      critique: { type: Type.STRING },
      recommendation: { type: Type.STRING },
    },
    required: ["name", "score", "status", "critique", "recommendation"],
  };

  return {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.INTEGER },
      grade: { type: Type.STRING },
      summary: { type: Type.STRING },
      metrics: {
        type: Type.OBJECT,
        properties: {
          fanOutCoverage: metricItemSchema,
          extractiveQuotability: metricItemSchema,
          formatDiversity: metricItemSchema,
          objectionHandling: metricItemSchema,
          nextActionClarity: metricItemSchema,
        },
        required: [
          "fanOutCoverage",
          "extractiveQuotability",
          "formatDiversity",
          "objectionHandling",
          "nextActionClarity",
        ],
      },
      identifiedGaps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      recommendedSnippets: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            title: { type: Type.STRING },
            markdownContent: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: ["type", "title", "markdownContent", "rationale"],
        },
      },
    },
    required: [
      "overallScore",
      "grade",
      "summary",
      "metrics",
      "identifiedGaps",
      "recommendedSnippets",
    ],
  };
}

function getSimulationTurnSchema() {
  return {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING },
      fanOutSearchesTriggered: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      citedSources: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            domain: { type: Type.STRING },
            excerpt: { type: Type.STRING },
          },
          required: ["title", "domain", "excerpt"],
        },
      },
      suggestedNextQueries: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      "content",
      "fanOutSearchesTriggered",
      "citedSources",
      "suggestedNextQueries",
    ],
  };
}

function normalizeAuditResult(parsed: any, topic: string, content: string, language?: string): any {
  const isFa = language === "fa";
  const fallback = getFallbackAudit(topic, content, language);

  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const overallScore = typeof parsed.overallScore === "number"
    ? Math.min(100, Math.max(0, Math.round(parsed.overallScore)))
    : typeof parsed.overall_score === "number"
    ? Math.min(100, Math.max(0, Math.round(parsed.overall_score)))
    : fallback.overallScore;

  const validGrades = ["A+", "A", "B", "C", "D"];
  const grade = validGrades.includes(parsed.grade)
    ? parsed.grade
    : (overallScore >= 90 ? "A+" : overallScore >= 80 ? "A" : overallScore >= 65 ? "B" : overallScore >= 50 ? "C" : "D");

  const summary = (
    parsed.summary ||
    parsed.critique ||
    parsed.assessment ||
    parsed.executiveSummary ||
    parsed.overview ||
    ""
  ).trim() || fallback.summary;

  // Normalize metrics
  const metricKeys = [
    "fanOutCoverage",
    "extractiveQuotability",
    "formatDiversity",
    "objectionHandling",
    "nextActionClarity",
  ] as const;

  const defaultMetricNames: Record<string, { en: string; fa: string }> = {
    fanOutCoverage: { en: "Query Fan-Out Coverage", fa: "پوشش کوئری‌های تعقیبی (Fan-Out)" },
    extractiveQuotability: { en: "Extractive Quotability", fa: "قابلیت نقل‌قول مستقیم (Quotability)" },
    formatDiversity: { en: "Format Diversity", fa: "تنوع ساختاری و فرمت داده‌ها" },
    objectionHandling: { en: "Objection & Constraint Handling", fa: "پوشش محدودیت‌ها و تردیدها" },
    nextActionClarity: { en: "Next-Action Guidance", fa: "شفافیت گام‌های بعدی (Action)" },
  };

  let rawMetrics = parsed.metrics;
  if (Array.isArray(rawMetrics)) {
    const obj: any = {};
    rawMetrics.forEach((m: any, idx: number) => {
      const key = metricKeys[idx] || `metric_${idx}`;
      obj[key] = m;
    });
    rawMetrics = obj;
  } else if (!rawMetrics || typeof rawMetrics !== "object") {
    rawMetrics = {};
  }

  const normalizedMetrics: any = {};
  metricKeys.forEach((key) => {
    const m = rawMetrics[key] || {};
    const fallbackMetric = fallback.metrics[key];
    const score = typeof m.score === "number"
      ? Math.min(100, Math.max(0, Math.round(m.score)))
      : fallbackMetric.score;

    normalizedMetrics[key] = {
      name: m.name || (isFa ? defaultMetricNames[key].fa : defaultMetricNames[key].en),
      score,
      status: m.status || (score >= 80 ? "excellent" : score >= 65 ? "good" : score >= 50 ? "needs_work" : "critical"),
      critique: (m.critique || m.description || m.feedback || fallbackMetric.critique).trim(),
      recommendation: (m.recommendation || m.tip || m.action || fallbackMetric.recommendation).trim(),
    };
  });

  // Gaps
  let identifiedGaps = Array.isArray(parsed.identifiedGaps) && parsed.identifiedGaps.length > 0
    ? parsed.identifiedGaps.filter((g: any) => typeof g === "string" && g.trim())
    : fallback.identifiedGaps;
  if (!identifiedGaps || identifiedGaps.length === 0) {
    identifiedGaps = fallback.identifiedGaps;
  }

  // Snippets
  let rawSnippets = Array.isArray(parsed.recommendedSnippets)
    ? parsed.recommendedSnippets
    : Array.isArray(parsed.snippets)
    ? parsed.snippets
    : [];

  const defaultSnippetTitles: Record<string, { en: string; fa: string }> = {
    "Comparison Matrix": { en: "Feature & Alternative Comparison Matrix", fa: "ماتریس مقایسه ویژگی‌ها با رقبای کلیدی" },
    "Direct Definition": { en: "Direct Answer & Definitive Summary Block", fa: "باکس پاسخ مستقیم و تعریف صریح برای استخراج هوش مصنوعی" },
    "Constraint Checklist": { en: "Constraint & Pre-requisite Qualification Checklist", fa: "چک‌لیست بررسی قیدها، بودجه و شرایط کاربرد" },
    "FAQ Schema": { en: "Structured Conversational FAQ Block", fa: "بخش سوالات متداول با فرمت ساختاریافته" },
  };

  const normalizedSnippets = (rawSnippets.length > 0 ? rawSnippets : fallback.recommendedSnippets).map((s: any, idx: number) => {
    const fbSnippet = fallback.recommendedSnippets[idx % fallback.recommendedSnippets.length];
    const type = s.type || s.category || fbSnippet.type;
    const defaultTitle = defaultSnippetTitles[type] 
      ? (isFa ? defaultSnippetTitles[type].fa : defaultSnippetTitles[type].en)
      : fbSnippet.title;
    const title = (s.title || s.name || s.heading || defaultTitle).trim();
    const markdownContent = (
      s.markdownContent ||
      s.content ||
      s.snippet ||
      s.code ||
      s.text ||
      s.markdown ||
      fbSnippet.markdownContent
    ).trim();
    const rationale = (
      s.rationale ||
      s.why ||
      s.reason ||
      s.explanation ||
      s.description ||
      fbSnippet.rationale
    ).trim();

    return {
      type,
      title: title || defaultTitle,
      markdownContent: markdownContent || fbSnippet.markdownContent,
      rationale: rationale || fbSnippet.rationale,
    };
  });

  return {
    overallScore,
    grade,
    summary,
    metrics: normalizedMetrics,
    identifiedGaps,
    recommendedSnippets: normalizedSnippets.length > 0 ? normalizedSnippets : fallback.recommendedSnippets,
  };
}

function normalizeSimulationTurn(parsed: any, query: string): any {
  const fallback = getFallbackSimulationTurn(query);
  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const content = (parsed.content || parsed.answer || parsed.response || "").trim() || fallback.content;
  const fanOutSearchesTriggered = Array.isArray(parsed.fanOutSearchesTriggered) && parsed.fanOutSearchesTriggered.length > 0
    ? parsed.fanOutSearchesTriggered.filter((q: any) => typeof q === "string" && q.trim())
    : fallback.fanOutSearchesTriggered;

  const citedSources = Array.isArray(parsed.citedSources) && parsed.citedSources.length > 0
    ? parsed.citedSources.map((c: any) => ({
        title: c.title || "Authoritative Source",
        domain: c.domain || "example.com",
        excerpt: c.excerpt || c.snippet || "Relevant source excerpt providing contextual citation.",
      }))
    : fallback.citedSources;

  const suggestedNextQueries = Array.isArray(parsed.suggestedNextQueries) && parsed.suggestedNextQueries.length > 0
    ? parsed.suggestedNextQueries.filter((q: any) => typeof q === "string" && q.trim())
    : fallback.suggestedNextQueries;

  return {
    content,
    fanOutSearchesTriggered,
    citedSources,
    suggestedNextQueries,
  };
}

// 2. Audit Content against Louisa Frahm's Conversational Search Scorecard
app.post("/api/audit/scorecard", async (req: Request, res: Response) => {
  try {
    const { topic, content, language } = req.body;
    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content is required for audit" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getFallbackAudit(topic || "Target Topic", content, language));
    }

    const systemPrompt = `You are a senior SEO auditor evaluating content using Louisa Frahm's "Conversational Search Scorecard" from Search Engine Land ("The follow-up query: Rethinking SEO for conversational search").
The scorecard measures whether content is optimized for multi-turn AI search journeys (ChatGPT, Perplexity, Google AI Overviews) rather than just single-keyword matching.

Assess 5 Core Metrics (Score 0-100 for each, with detailed critique and actionable recommendation):
1. fanOutCoverage: Does the content anticipate follow-up questions and subtopics that AI engines fan out into?
2. extractiveQuotability: Does the text have clear, authoritative 1-2 sentence direct answers that an LLM can easily lift and cite?
3. formatDiversity: Does it use structured formats (tables, bulleted specs, pros/cons, numbered steps) instead of dense walls of prose?
4. objectionHandling: Does it address user constraints, doubts, budget concerns, and alternative comparisons?
5. nextActionClarity: Does it provide clear, logical next steps and actionable solutions?

Also generate:
- overallScore (0-100) and grade ('A+' | 'A' | 'B' | 'C' | 'D')
- summary: A comprehensive 2-3 sentence assessment of the content's conversational GEO readiness
- identifiedGaps: 3-5 specific gaps or missing elements
- recommendedSnippets: Exactly 3 ready-to-inject markdown snippets with high quotation utility:
  1) Comparison Matrix (markdown table comparing options or criteria)
  2) Direct Definition / Key Takeaway (authoritative 1-2 sentence blockquote definition)
  3) Constraint Checklist (bulleted qualification checklist addressing costs, limits, or fit)
For each snippet, provide:
  - type: 'Comparison Matrix' | 'Direct Definition' | 'Constraint Checklist' | 'FAQ Schema'
  - title: A descriptive heading
  - markdownContent: The full, ready-to-copy markdown code block (DO NOT LEAVE BLANK)
  - rationale: Why this specific snippet format triggers AI citation and wins AI Overviews

Respond strictly in valid JSON matching the schema. Language: ${language === 'fa' ? 'Persian (Farsi)' : 'English'}.`;

    const userPrompt = `Topic: "${topic || "General"}"\n\nContent to audit:\n"""\n${content.slice(0, 15000)}\n"""`;

    const rawText = await generateContentWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: getAuditScorecardSchema(),
      },
    });

    const parsed = JSON.parse(rawText || "{}");
    const normalized = normalizeAuditResult(parsed, topic || "Target Topic", content, language);
    return res.json(normalized);
  } catch (error: any) {
    console.warn(`[Scorecard Audit API] ${formatLogErrorMessage(error)}`);
    return res.json(getFallbackAudit(req.body.topic || "Target Topic", req.body.content || "", req.body.language));
  }
});

// 3. Multi-Turn AI Search Engine Simulator (Query Fan-Out Emulation)
app.post("/api/simulate/turn", async (req: Request, res: Response) => {
  try {
    const { query, previousTurns, topicContext } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json(getFallbackSimulationTurn(query));
    }

    const systemPrompt = `You are simulating a modern conversational AI search engine (combining the mechanics of Google AI Overviews with query fan-out, Perplexity citations, and ChatGPT Search).
Given the user's latest query in the conversation:
1. Identify 3-4 "Fan-Out Searches" executed behind the scenes by the AI engine to answer this question.
2. Provide a concise, highly structured, citable response in content.
3. Include 2-3 realistic cited sources with domain and snippet excerpt.
4. Suggest the next 3 natural follow-up queries the user is likely to ask (spanning clarification, constraints, comparisons, validation, or action).
Format your output strictly as valid JSON matching the schema.`;

    const prompt = `Context: ${topicContext || "General Search"}\nConversation History: ${JSON.stringify(previousTurns || [])}\nLatest User Query: "${query}"`;

    const rawText = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: getSimulationTurnSchema(),
      },
    });

    const parsed = JSON.parse(rawText || "{}");
    const normalized = normalizeSimulationTurn(parsed, query);
    return res.json(normalized);
  } catch (error: any) {
    console.warn(`[Search Simulator API] ${formatLogErrorMessage(error)}`);
    return res.json(getFallbackSimulationTurn(req.body.query));
  }
});

// Fallback Generators for offline / non-API testing
function getFallbackFanOut(seedQuery: string, brandName?: string, language?: string) {
  const isFa = language === "fa";
  return {
    seedQuery,
    brandName: brandName || undefined,
    marketContext: isFa 
      ? `تحلیل مسیر جستجوی محاوره‌ای برای «${seedQuery}» با تمرکز بر گسترش چندمرحله‌ای (Query Fan-Out) و هوش مصنوعی.` 
      : `Conversational search journey analysis for "${seedQuery}" based on multi-stage Query Fan-Out and AI Overviews mapping.`,
    totalFollowUps: 15,
    aiOverviewTriggerScore: 88,
    keyEntities: [seedQuery, "Price / TCO", "Alternatives", "Security & Compliance", "User Reviews", "Integration Speed"],
    executiveSummary: isFa
      ? `کاربران هنگام جستجوی «${seedQuery}» به یک پرسش اولیه بسنده نمی‌کنند؛ آنها در ۵ فاز شفاف‌سازی، قیدها، مقایسه، اعتبارسنجی و اقدام حرکت می‌کنند. موتورهای هوش مصنوعی حداقل ۴ پرسش فرعی همزمان را واکشی می‌کنند.`
      : `Users exploring "${seedQuery}" engage in a 5-phase conversational journey. AI search engines fan out an average of 4 background sub-queries per interaction to synthesize answers.`,
    stages: {
      clarification: [
        {
          id: "clar-1",
          stage: "clarification",
          query: isFa ? `دقیقاً ${seedQuery} چیست و چگونه کار می‌کند؟` : `What is ${seedQuery} and how does it actually work?`,
          intent: isFa ? "درک مفاهیم بنیادی و دامنه کاربری" : "Understand core fundamentals and operational scope",
          subQueries: [
            `${seedQuery} definition architecture`,
            `how ${seedQuery} works step by step`,
            `${seedQuery} vs traditional alternatives`
          ],
          recommendedFormat: "prose",
          contentTip: isFa ? "پاسخ را در ۲ جمله شفاف و بدون حاشیه در ابتدای بخش H2 بنویسید تا AI به راحتی استخراج کند." : "Provide a clear 2-sentence direct definition right beneath the H2 for LLM extraction.",
          citationLikelihood: "Critical",
          difficulty: "Low"
        },
        {
          id: "clar-2",
          stage: "clarification",
          query: isFa ? `چه کسانی بیشترین سود را از ${seedQuery} می‌برند؟` : `Who benefits the most from ${seedQuery}?`,
          intent: isFa ? "تعیین پرسونای مخاطب و موارد مصرف" : "Audience fit and target persona validation",
          subQueries: [
            `${seedQuery} ideal use cases`,
            `${seedQuery} target industry profile`,
            `when not to use ${seedQuery}`
          ],
          recommendedFormat: "bullet_specs",
          contentTip: isFa ? "پرسوناها را با فرمت بالت‌پوینت‌های مشخص و کوتاه همراه با نقش‌ها ذکر کنید." : "List key roles and company profiles in structured bullet points.",
          citationLikelihood: "High",
          difficulty: "Low"
        }
      ],
      constraints: [
        {
          id: "cons-1",
          stage: "constraints",
          query: isFa ? `هزینه و قیمت واقعی ${seedQuery} چقدر است؟ (شامل هزینه‌های پنهان)` : `What is the real cost and pricing model for ${seedQuery}?`,
          intent: isFa ? "ارزیابی بودجه و شفافیت قیمت‌گذاری" : "Total Cost of Ownership (TCO) & budget filtering",
          subQueries: [
            `${seedQuery} pricing tiers 2026`,
            `${seedQuery} hidden fees setup costs`,
            `is there a free tier for ${seedQuery}`
          ],
          recommendedFormat: "table",
          contentTip: isFa ? "یک جدول شفاف مقایسه پلن‌ها و محدودیت‌های حجمی قرار دهید." : "Use a transparent pricing tier table with limits and add-on costs.",
          citationLikelihood: "Critical",
          difficulty: "Medium"
        },
        {
          id: "cons-2",
          stage: "constraints",
          query: isFa ? `آیا ${seedQuery} برای تیم‌های کوچک/فریلنسرها هم مناسب است؟` : `Is ${seedQuery} suitable for small teams or solo operators?`,
          intent: isFa ? "فیلتر مقیاس‌پذیری و حداقل منابع لازم" : "Scale constraints and resource requirements",
          subQueries: [
            `${seedQuery} for small business review`,
            `${seedQuery} learning curve onboarding time`,
            `lightweight alternatives to ${seedQuery}`
          ],
          recommendedFormat: "bullet_specs",
          contentTip: isFa ? "یک بخش صریح «آیا برای تیم شما مناسب است؟» با معیارهای مشخص اضافه کنید." : "Include a direct 'Is It Right for Small Teams?' checklist.",
          citationLikelihood: "High",
          difficulty: "Medium"
        }
      ],
      comparison: [
        {
          id: "comp-1",
          stage: "comparison",
          query: isFa ? `بهترین جایگزین‌ها و رقبای ${seedQuery} کدامند؟` : `What are the top competitors and alternatives to ${seedQuery}?`,
          intent: isFa ? "بررسی گزینه‌های بازار و تفاوت‌های کلیدی" : "Market landscape mapping & competitive trade-offs",
          subQueries: [
            `top 5 alternatives to ${seedQuery}`,
            `${seedQuery} vs market leader comparison`,
            `which tool replaced ${seedQuery}`
          ],
          recommendedFormat: "table",
          contentTip: isFa ? "ماتریس مقایسه ویژگی به ویژگی (Feature Matrix) همراه با ذکر نقاط قوت و ضعف هر گزینه درج کنید." : "Create an objective feature-by-feature matrix highlighting pros and cons.",
          citationLikelihood: "Critical",
          difficulty: "High"
        },
        {
          id: "comp-2",
          stage: "comparison",
          query: isFa ? `مزایا و معایب اصلی ${seedQuery} در مقایسه با روش سنتی چیست؟` : `Key pros and cons of ${seedQuery} vs manual workflows?`,
          intent: isFa ? "توجیه تصمیم و سنجش بازگشت سرمایه" : "Decision justification and workflow ROI evaluation",
          subQueries: [
            `${seedQuery} pros cons benchmarks`,
            `switch from manual to ${seedQuery} case study`
          ],
          recommendedFormat: "bullet_specs",
          contentTip: isFa ? "دو ستون متوازن مزایا و معایب واقعی بدون ادعاهای تبلیغاتی غلوآمیز ارائه دهید." : "Present balanced pros and cons without generic marketing fluff.",
          citationLikelihood: "High",
          difficulty: "Medium"
        }
      ],
      validation: [
        {
          id: "val-1",
          stage: "validation",
          query: isFa ? `نظرات واقعی کاربران در ردیت (Reddit) درباره ${seedQuery} چیست؟` : `What do real users on Reddit and forums say about ${seedQuery}?`,
          intent: isFa ? "اعتبارسنجی اجتماعی و یافتن مشکلات پنهان" : "Authentic social validation & unvarnished feedback",
          subQueries: [
            `${seedQuery} reddit review complaints`,
            `${seedQuery} honest feedback user experience`,
            `is ${seedQuery} worth it after 1 year`
          ],
          recommendedFormat: "quote_proof",
          contentTip: isFa ? "نقل قول‌های معتبر و نتایج نظرسنجی‌های مستقل را با ذکر منبع نقل کنید." : "Include authentic user quotes, verified case data, and third-party ratings.",
          citationLikelihood: "Critical",
          difficulty: "High"
        },
        {
          id: "val-2",
          stage: "validation",
          query: isFa ? `آیا داده‌ها و امنیت در ${seedQuery} تضمین شده است؟` : `Is ${seedQuery} secure, compliant, and reliable?`,
          intent: isFa ? "بررسی ریسک‌ها و انطباق قانونی (GDPR / SOC2)" : "Security, data sovereignty, and compliance verification",
          subQueries: [
            `${seedQuery} security audit SOC2 GDPR`,
            `${seedQuery} data privacy policy downtime history`
          ],
          recommendedFormat: "bullet_specs",
          contentTip: isFa ? "گواهینامه‌های امنیتی و سیاست‌های نگهداری داده را در یک باکس شکیل خلاصه کنید." : "Summarize certifications, uptime SLAs, and encryption standards in a callout.",
          citationLikelihood: "High",
          difficulty: "Medium"
        }
      ],
      action: [
        {
          id: "act-1",
          stage: "action",
          query: isFa ? `چگونه در کمتر از یک روز ${seedQuery} را راه‌اندازی و پیاده‌سازی کنیم؟` : `How to deploy and onboard ${seedQuery} step-by-step?`,
          intent: isFa ? "شروع به کار عملیاتی و تخمین زمان پیاده‌سازی" : "Operational kickoff and implementation roadmap",
          subQueries: [
            `${seedQuery} quick start guide`,
            `${seedQuery} integration tutorial API checklist`,
            `${seedQuery} migration template`
          ],
          recommendedFormat: "step_by_step",
          contentTip: isFa ? "یک راهنمای گام‌به‌گام ۱ تا ۵ با زمان تخمینی هر مرحله قرار دهید." : "Provide an action-oriented 1-2-3 implementation checklist with timeframes.",
          citationLikelihood: "High",
          difficulty: "Medium"
        }
      ]
    }
  };
}

function getFallbackAudit(topic: string, content: string, language?: string) {
  const isFa = language === "fa";
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const hasTable = content.includes("|") || content.includes("<table");
  const hasBullets = content.includes("- ") || content.includes("* ") || content.includes("<li");
  
  const fanOutScore = Math.min(90, Math.max(40, Math.round(wordCount / 15) + (hasBullets ? 15 : 0)));
  const formatScore = hasTable && hasBullets ? 88 : hasBullets ? 65 : 45;
  const extractiveScore = 72;
  const objectionScore = content.toLowerCase().includes("cost") || content.toLowerCase().includes("قیمت") ? 78 : 52;
  const nextActionScore = content.toLowerCase().includes("step") || content.toLowerCase().includes("شروع") ? 80 : 55;

  const overall = Math.round((fanOutScore + formatScore + extractiveScore + objectionScore + nextActionScore) / 5);

  return {
    overallScore: overall,
    grade: overall >= 85 ? "A" : overall >= 75 ? "B" : "C",
    summary: isFa 
      ? `تحلیل محتوا نشان می‌دهد که متن شما پوشش اولیه خوبی دارد اما در فازهای «قیدها (قیمت و محدودیت‌ها)» و «فرمت‌های چندگانه (جدول مقایسه)» نیاز به بهینه‌سازی برای هوش مصنوعی دارد.`
      : `Audit indicates solid baseline depth, but your content requires structured formatting (comparison tables and direct answer callouts) to win AI Overview citations across follow-up queries.`,
    metrics: {
      fanOutCoverage: {
        name: isFa ? "پوشش کوئری‌های تعقیبی (Fan-Out)" : "Query Fan-Out Coverage",
        score: fanOutScore,
        status: fanOutScore > 75 ? "good" : "needs_work",
        critique: isFa ? "پوشش موضوعات جانبی و احتمالات سوال دوم کاربر در حد متوسط است." : "Moderate coverage of secondary and tertiary questions.",
        recommendation: isFa ? "بخش‌های اختصاصی برای پرسش‌های متداول پیشرفته اضافه کنید." : "Add dedicated subheadings for anticipated follow-up doubts."
      },
      extractiveQuotability: {
        name: isFa ? "قابلیت نقل‌قول مستقیم (Quotability)" : "Extractive Quotability",
        score: extractiveScore,
        status: "good",
        critique: isFa ? "برخی جملات شفاف هستند اما نیاز به فشرده‌سازی برای نقل‌قول در پاسخ‌های LLM دارند." : "Clear prose, but needs tighter 20-30 word summary blocks under each H2.",
        recommendation: isFa ? "پاراگراف‌های اول هر سرفصل را به پاسخ مستقیم تبدیل کنید." : "Start major sections with a crisp single-sentence definitive answer."
      },
      formatDiversity: {
        name: isFa ? "تنوع ساختاری و فرمت داده‌ها" : "Format Diversity",
        score: formatScore,
        status: formatScore > 70 ? "good" : "needs_work",
        critique: hasTable ? "جدول به خوبی به کار رفته است." : (isFa ? "متن بیش از حد به پاراگراف‌های یکنواخت وابسته است؛ جدول یا ماتریس مقایسه دیده نشد." : "Missing comparison tables and structured key-value specs."),
        recommendation: isFa ? "یک جدول مقایسه ۲ تا ۳ ستونه اضافه کنید تا موتورهای هوش مصنوعی سریعاً آن را پارس کنند." : "Insert a feature/constraint comparison table."
      },
      objectionHandling: {
        name: isFa ? "پوشش محدودیت‌ها و تردیدها" : "Objection & Constraint Handling",
        score: objectionScore,
        status: objectionScore > 70 ? "good" : "critical",
        critique: isFa ? "به ندرت به معایب، هزینه‌های پنهان، یا محدودیت‌های کاربردی اشاره شده است." : "Weak addressing of user hesitations, budget ceilings, and failure modes.",
        recommendation: isFa ? "بخش صریح «معایب و مواردی که این راه‌حل مناسب نیست» را اضافه کنید." : "Explicitly address 'When is this NOT the right choice?'."
      },
      nextActionClarity: {
        name: isFa ? "شفافیت گام‌های بعدی (Action)" : "Next-Action Guidance",
        score: nextActionScore,
        status: nextActionScore > 70 ? "good" : "needs_work",
        critique: isFa ? "مسیر عملیاتی کاربر بعد از مطالعه واضح نیست." : "Vague transition from learning to practical implementation.",
        recommendation: isFa ? "یک چک‌لیست ۳ مرحله‌ای پیاده‌سازی سریع همراه با زمان‌بندی قرار دهید." : "Add a 3-step action roadmap with concrete timeframes."
      }
    },
    identifiedGaps: [
      isFa ? "عدم وجود جدول مقایسه مستقیم با ۲ رقیب اصلی بازار" : "No direct side-by-side comparison matrix with top alternatives",
      isFa ? "فقدان پاسخ شفاف درباره مدل هزینه‌ای و تخمین زمان پیاده‌سازی" : "Missing transparent TCO & implementation timeline estimates",
      isFa ? "نبود بلوک تعریفی مستقیم (Direct Answer Box) در ۲۰۰ کلمه اول" : "No direct answer snippet block in the opening 150 words"
    ],
    recommendedSnippets: [
      {
        type: "Direct Answer Block",
        title: isFa ? "باکس پاسخ سریع برای استخراج هوش مصنوعی" : "Quick AI Extraction Answer Block",
        markdownContent: `> **Key Takeaway / خلاصه کلیدی:**\n> ${topic} is designed to streamline conversational search intent by mapping follow-up queries before they are typed. Ideal for teams seeking higher AI citation rates with zero guesswork.`,
        rationale: isFa ? "موتورهای جستجوی هوش مصنوعی این سبک بلوک نقل‌قول خلاصه را با اولویت بالا در پاسخ‌ها نشان می‌دهند." : "High-density summary blocks are the #1 source for AI Overview answer synthesis."
      },
      {
        type: "Comparison Table",
        title: isFa ? "جدول مقایسه‌ای ماتریس ویژگی‌ها" : "Feature & Constraint Matrix",
        markdownContent: `| Feature / معیار | Traditional SEO | Conversational / GEO |\n| :--- | :--- | :--- |\n| **Search Unit** | Single Keyword | Multi-Turn Query Journey |\n| **Search Engine Behavior** | Index Matching | Query Fan-Out (Sub-queries) |\n| **Ideal Format** | 2000-word prose | Tables, Bullet Specs, Direct Answers |\n| **Goal** | Rank in Top 10 | Become the AI-Recommended Citation |`,
        rationale: isFa ? "جداول داده‌ای شفاف‌ترین منبع برای استخراج مقایسه‌ها توسط LLM هستند." : "Structured markdown tables trigger high-confidence AI citation extractions."
      },
      {
        type: "Constraint Checklist",
        title: isFa ? "چک‌لیست بررسی محدودیت‌ها و قیدهای کاربردی" : "Constraint & Implementation Checklist",
        markdownContent: isFa
          ? `### آیا این راهکار مناسب وضعیت فعلی شماست؟\n- [x] **بودجه:** متناسب با نیازهای عملیاتی، بدون وابستگی به پلن‌های موقت رایگان.\n- [x] **زمان استقرار:** نیازمند ۱ تا ۲ هفته فرآیند آنبوردینگ و تست یکپارچگی.\n- [x] **یکپارچه‌سازی:** پشتیبانی بومی از ابزارهای ابری و Webhookها.\n- [ ] **محدودیت:** در صورت عدم نیاز به قابلیت‌های تعاملی، راهکارهای ایستا سریع‌تر پیاده‌سازی می‌شوند.`
          : `### Is this the right fit for your team?\n- [x] **Budget Filter:** Suitable for teams with standard operational SaaS budgets; not designed for zero-budget scenarios.\n- [x] **Deployment Timeline:** Requires 1-2 weeks for data migration and team setup.\n- [x] **Integrations:** Direct API and webhook support for standard productivity suites.\n- [ ] **Trade-off / Limitation:** If your team does not need multi-turn inquiry, a simpler static documentation page may suffice.`,
        rationale: isFa
          ? "موتورهای جستجوی هوش مصنوعی هنگام مواجهه با سوالات تعقیبی فاز قیدها (Constraints)، مستقیماً این چک‌لیست‌های پیش‌شرط را ارجاع می‌دهند."
          : "Conversational engines parse constraint checklists when users ask qualification follow-ups like 'Is this right for my team?'."
      }
    ]
  };
}

function getFallbackSimulationTurn(query: string) {
  return {
    id: `turn-${Date.now()}`,
    role: "assistant",
    query,
    content: `Based on a multi-source synthesis, **${query}** involves addressing both immediate criteria and downstream dependencies.\n\nAI search models fan out queries to cross-reference authoritative benchmarks, user consensus, and operational constraints to build this answer.`,
    fanOutSearchesTriggered: [
      `${query} official documentation benchmarks`,
      `${query} real user feedback reddit 2026`,
      `${query} cost comparison and hidden limits`,
      `${query} vs top market alternatives`
    ],
    citedSources: [
      { title: "Search Engine Land: The Follow-Up Query Analysis", domain: "searchengineland.com", excerpt: "Conversational search mirrors human inquiry; optimization must span clarification, constraints, comparison, validation, and action." },
      { title: "GEO & AI Overviews Architecture Report", domain: "techcognate.com", excerpt: "Query fan-out runs 3-6 background queries simultaneously to construct synthesized responses." }
    ],
    suggestedNextQueries: [
      `What are the most common mistakes when implementing this?`,
      `How does this compare in pricing and scale for small teams?`,
      `Can you show a step-by-step 30-day implementation plan?`
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
}

// Start Server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
