import React, { useState } from "react";
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Layers, 
  ExternalLink 
} from "lucide-react";
import { translations } from "../data/translations";
import { FanOutAnalysisResult } from "../types";

interface ContentBriefViewProps {
  lang: 'en' | 'fa';
  analysisResult: FanOutAnalysisResult | null;
  onGoToFanOut: () => void;
}

export const ContentBriefView: React.FC<ContentBriefViewProps> = ({
  lang,
  analysisResult,
  onGoToFanOut,
}) => {
  const t = translations[lang];
  const isRtl = lang === "fa";
  const [copied, setCopied] = useState(false);

  if (!analysisResult) {
    return (
      <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
        <FileText className="w-10 h-10 text-slate-400 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">
          {lang === "fa" ? "هنوز موضوعی برای ساخت بریف تحلیل نشده است" : "No Topic Analyzed Yet"}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {lang === "fa"
            ? "ابتدا در تب «نقشه سفر کوئری»، یک موضوع اولیه را جستجو کنید تا نقشه ۵ گانه تولید و طرح محتوا به صورت خودکار تدوین شود."
            : "Run an analysis in the 'Query Fan-Out & Journey' tab first to generate a structured content architecture blueprint."}
        </p>
        <button
          onClick={onGoToFanOut}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          {lang === "fa" ? "رفتن به صفحه نقشه سفر کوئری" : "Go to Query Fan-Out Tab"}
        </button>
      </div>
    );
  }

  // Build the markdown brief string
  const generateMarkdownBrief = () => {
    const isFa = lang === "fa";
    return `# ${isFa ? "طرح جامع تولید محتوا بر مبنای سفر محاوره‌ای" : "Conversational Search Content Brief (GEO Blueprint)"}
## Topic / Seed Query: ${analysisResult.seedQuery}
${analysisResult.brandName ? `**Brand Focus:** ${analysisResult.brandName}\n` : ""}
**Estimated AI Overview Propensity:** ${analysisResult.aiOverviewTriggerScore}%  
**Target Entities:** ${analysisResult.keyEntities.join(", ")}

---

### Executive Conversational Strategy
${analysisResult.executiveSummary}

---

### Content Architecture Outline (Optimized for AI Overviews & Query Fan-Out)

#### 1. Definition & Fundamentals (Clarification Phase)
- **Goal:** Provide a crisp 2-sentence direct definition immediately beneath the H2 header.
- **Key Follow-Up Questions Addressed:**
${analysisResult.stages.clarification.map(q => `  - ${q.query} *(Format: ${q.recommendedFormat})*`).join("\n")}
- **Recommended Snippet Structure:**
> **Direct Answer Box:** Concise, jargon-free summary (max 35 words) answering what ${analysisResult.seedQuery} is and who it is built for.

#### 2. Constraints & Pricing (Budget / Fit Phase)
- **Goal:** Transparent breakdown of costs, team limits, and system constraints.
- **Key Follow-Up Questions Addressed:**
${analysisResult.stages.constraints.map(q => `  - ${q.query} *(Format: ${q.recommendedFormat})*`).join("\n")}
- **Recommended Format:** Pricing tiers comparison table & "Who is this NOT for" checklist.

#### 3. Competitive Landscape (Comparison Phase)
- **Goal:** Structured feature matrix comparing alternatives.
- **Key Follow-Up Questions Addressed:**
${analysisResult.stages.comparison.map(q => `  - ${q.query} *(Format: ${q.recommendedFormat})*`).join("\n")}
- **Required Asset:** Side-by-side markdown table with at least 3 alternatives and concrete trade-offs.

#### 4. Trust & Social Proof (Validation Phase)
- **Goal:** Mitigate risks, cite benchmarks, and address Reddit/community consensus.
- **Key Follow-Up Questions Addressed:**
${analysisResult.stages.validation.map(q => `  - ${q.query} *(Format: ${q.recommendedFormat})*`).join("\n")}
- **Recommended Format:** Verified data callout, security certifications, and honest user reviews.

#### 5. Implementation Roadmap (Action Phase)
- **Goal:** Clear next steps with zero friction.
- **Key Follow-Up Questions Addressed:**
${analysisResult.stages.action.map(q => `  - ${q.query} *(Format: ${q.recommendedFormat})*`).join("\n")}
- **Recommended Format:** Step-by-step numbered checklist (1-2-3 implementation roadmap).
`;
  };

  const markdownText = generateMarkdownBrief();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `content-brief-${analysisResult.seedQuery.replace(/\s+/g, "-").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multi-Turn Content Blueprint</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === "fa" ? "طرح جامع تولید محتوا (Content Architecture Brief)" : "Conversational Search Content Blueprint"}
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {lang === "fa"
                ? "بریف استاندارد و بهینه‌سازی‌شده برای نویسندگان محتوا جهت تبدیل مقاله به پاسخ مرجع در موتورهای هوش مصنوعی."
                : "A ready-to-use content brief structured directly according to Louisa Frahm's 5-stage taxonomy."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === "fa" ? "کپی مارک‌داون" : "Copy Markdown"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "fa" ? "دانلود فایل MD" : "Download .MD"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Markdown Preview Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px]">
          {markdownText}
        </pre>
      </div>
    </div>
  );
};
