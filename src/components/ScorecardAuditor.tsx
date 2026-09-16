import React, { useState } from "react";
import { 
  FileCheck2, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Copy, 
  Layers, 
  TrendingUp, 
  FileSpreadsheet, 
  HelpCircle, 
  ArrowUpRight 
} from "lucide-react";
import { translations } from "../data/translations";
import { sampleDraftAuditContent } from "../data/sampleTopics";
import { AuditResult, ScorecardMetric } from "../types";

interface ScorecardAuditorProps {
  lang: 'en' | 'fa';
  auditResult: AuditResult | null;
  setAuditResult: (res: AuditResult | null) => void;
  defaultTopic?: string;
}

export const ScorecardAuditor: React.FC<ScorecardAuditorProps> = ({
  lang,
  auditResult,
  setAuditResult,
  defaultTopic,
}) => {
  const t = translations[lang];
  const isRtl = lang === "fa";

  const [topic, setTopic] = useState(defaultTopic || (lang === 'fa' ? "راهنمای انتخاب نرم‌افزار CRM" : "How to Choose B2B CRM"));
  const [content, setContent] = useState(sampleDraftAuditContent);
  const [loading, setLoading] = useState(false);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (defaultTopic) {
      setTopic(defaultTopic);
    }
  }, [defaultTopic]);

  const handleRunAudit = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/audit/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          content,
          language: lang,
        }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  const getMetricColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Louisa Frahm's Scorecard Evaluation Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.auditTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            {t.auditSubtitle}
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {lang === "fa" ? "موضوع اصلی مقاله یا صفحه وب:" : "Primary Topic / Query Target:"}
            </label>
            <input
              id="audit-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.topicPlaceholder}
              className="w-full h-11 bg-white border border-slate-300 rounded-xl px-4 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {lang === "fa" ? "متن پیش‌نویس، محتوا یا سرفصل‌های صفحه:" : "Draft Text, Article Content, or Outline:"}
              </label>
              <button
                type="button"
                onClick={() => setContent(sampleDraftAuditContent)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                {lang === "fa" ? "بارگذاری متن نمونه" : "Load Sample Text"}
              </button>
            </div>
            <textarea
              id="audit-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.pasteContentPlaceholder}
              className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="run-audit-btn"
              onClick={handleRunAudit}
              disabled={loading || !content.trim()}
              className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'fa' ? 'در حال ارزیابی...' : 'Auditing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.runAuditBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base font-semibold text-slate-900">{t.auditing}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {lang === "fa"
              ? "تحلیل چگالی نقل‌قول مستقیم، پوشش پرسش‌های فرعی، تنوع فرمت و قدرت پاسخ به تردیدها..."
              : "Analyzing extractive quotability, query fan-out breadth, and format diversity..."}
          </p>
        </div>
      )}

      {/* Audit Results */}
      {!loading && auditResult && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Grade & Overall Score */}
            <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-3xl font-black text-indigo-600 font-display">
                  {auditResult.grade || "B"}
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider">
                  Grade
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-0.5">
                  {t.overallScore}
                </span>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  {typeof auditResult.overallScore === "number" ? auditResult.overallScore : 65}
                  <span className="text-slate-400 text-lg font-normal">/100</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {(auditResult.overallScore || 0) >= 80
                    ? (lang === "fa" ? "آماده ارجاع به عنوان پاسخ برگزیده AI" : "High probability of AI recommendation")
                    : (lang === "fa" ? "نیاز به تقویت فرمت و پاسخ به تردیدها" : "Needs structured formatting & objection handling")}
                </p>
              </div>
            </div>

            {/* Critique Summary */}
            <div className="md:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                {lang === "fa" ? "تحلیل جامع وضعیت سئوی محاوره‌ای محتوا" : "Conversational GEO Assessment"}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {auditResult.summary ||
                  (auditResult as any).critique ||
                  (auditResult as any).assessment ||
                  (auditResult as any).executiveSummary ||
                  (isRtl
                    ? "ارزیابی جامع متن نشان می‌دهد که برای تبدیل شدن به پاسخ استنادی هوش مصنوعی، نیاز به ایجاد پاسخ‌های صریح و جداول مقایسه قیدها دارید."
                    : "Comprehensive assessment indicates your content requires explicit direct answer blocks and structured trade-off tables to maximize conversational AI citations.")}
              </p>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{t.metricsBreakdown}</span>
            </h2>

            {(() => {
              const rawMetrics = auditResult.metrics || {};
              const defaultMetricNames: Record<string, { en: string; fa: string }> = {
                fanOutCoverage: { en: "Query Fan-Out Coverage", fa: "پوشش کوئری‌های تعقیبی (Fan-Out)" },
                extractiveQuotability: { en: "Extractive Quotability", fa: "قابلیت نقل‌قول مستقیم (Quotability)" },
                formatDiversity: { en: "Format Diversity", fa: "تنوع ساختاری و فرمت داده‌ها" },
                objectionHandling: { en: "Objection & Constraint Handling", fa: "پوشش محدودیت‌ها و تردیدها" },
                nextActionClarity: { en: "Next-Action Guidance", fa: "شفافیت گام‌های بعدی (Action)" },
              };

              const metricList: { key: string; metric: ScorecardMetric }[] = Array.isArray(rawMetrics)
                ? rawMetrics.map((m: any, idx: number) => ({
                    key: m.id || m.key || `metric-${idx}`,
                    metric: {
                      name: m.name || m.title || `Metric ${idx + 1}`,
                      score: typeof m.score === "number" ? m.score : 60,
                      status: m.status || (m.score >= 80 ? "excellent" : m.score >= 65 ? "good" : "needs_work"),
                      critique: m.critique || m.description || m.feedback || (isRtl ? "پوشش این معیار در حد استاندارد ارزیابی شده است." : "Evaluated against multi-turn search criteria."),
                      recommendation: m.recommendation || m.tip || (isRtl ? "فرمت‌بندی و فشرده‌سازی برای نقل‌قول LLM." : "Format into structured, extractable text."),
                    },
                  }))
                : Object.entries(rawMetrics).map(([key, m]: [string, any]) => ({
                    key,
                    metric: {
                      name: m?.name || (defaultMetricNames[key] ? (isRtl ? defaultMetricNames[key].fa : defaultMetricNames[key].en) : key),
                      score: typeof m?.score === "number" ? m.score : 60,
                      status: m?.status || (m?.score >= 80 ? "excellent" : m?.score >= 65 ? "good" : "needs_work"),
                      critique: m?.critique || m?.description || m?.feedback || (isRtl ? "بررسی قابلیت استخراج پاسخ توسط هوش مصنوعی." : "Evaluated against conversational search criteria."),
                      recommendation: m?.recommendation || m?.tip || (isRtl ? "افزودن پاسخ مستقیم و حذف حواشی." : "Provide crisp direct answers."),
                    },
                  }));

              if (metricList.length === 0) {
                return (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    {isRtl ? "معیارهای ارزیابی در دسترس نیستند." : "No metrics currently available."}
                  </p>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metricList.map(({ key, metric }) => {
                    const badgeStyle = getMetricColor(metric.score);
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">
                              {metric.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${badgeStyle}`}>
                              {metric.score}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {metric.critique}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-[11px] text-indigo-900 font-medium bg-indigo-50/50 -mx-4 -mb-4 p-3 rounded-b-xl">
                          💡 {metric.recommendation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Identified Gaps */}
          {auditResult.identifiedGaps?.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
              <h2 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t.gapsTitle}</span>
              </h2>
              <ul className="space-y-2">
                {auditResult.identifiedGaps.map((gap, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-rose-600 font-bold select-none">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Injectable Snippets Section */}
          {Array.isArray(auditResult.recommendedSnippets) && auditResult.recommendedSnippets.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{t.readySnippets}</span>
                </h2>
                <span className="text-xs text-slate-500">
                  {lang === "fa" ? "کپی و جاگذاری مستقیم در متن وبسایت" : "Ready to copy-paste directly into your CMS"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResult.recommendedSnippets.map((rawSnippet: any, sIdx: number) => {
                  const snippetType = rawSnippet.type || rawSnippet.category || (isRtl ? "اسنیپت بهینه‌سازی" : "Optimization Snippet");
                  const snippetTitle = rawSnippet.title || rawSnippet.name || rawSnippet.heading || `${snippetType} Block`;
                  const markdownContent = (
                    rawSnippet.markdownContent ||
                    rawSnippet.content ||
                    rawSnippet.snippet ||
                    rawSnippet.code ||
                    rawSnippet.text ||
                    rawSnippet.markdown ||
                    (isRtl
                      ? `> **نکته کلیدی:** برای استخراج بهینه هوش مصنوعی، تعریف مستقیم ۲ جمله‌ای را اینجا قرار دهید.`
                      : `> **Key Takeaway:** Place a concise, 2-sentence direct answer here for AI extractability.`)
                  ).trim();
                  const rationale = (
                    rawSnippet.rationale ||
                    rawSnippet.why ||
                    rawSnippet.reason ||
                    rawSnippet.explanation ||
                    rawSnippet.description ||
                    (isRtl
                      ? "موتورهای جستجوی هوش مصنوعی این فرمت ساختاریافته را با اطمینان بالا نقل‌قول می‌کنند."
                      : "Conversational AI engines favor structured blocks for high-confidence answer synthesis.")
                  ).trim();

                  return (
                    <div
                      key={sIdx}
                      className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                            {snippetType}
                          </span>
                          <button
                            onClick={() => handleCopySnippet(markdownContent, sIdx)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            {copiedSnippetIndex === sIdx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">{t.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-medium">{t.copySnippet}</span>
                              </>
                            )}
                          </button>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 mb-2">
                          {snippetTitle}
                        </h3>

                        <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap overflow-x-auto max-h-48 leading-relaxed">
                          {markdownContent}
                        </pre>
                      </div>

                      <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                        <strong className="text-slate-800">
                          {lang === "fa" ? "دلیل بهینه‌سازی: " : "Why this works: "}
                        </strong>
                        {rationale}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
