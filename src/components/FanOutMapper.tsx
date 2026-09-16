import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Sliders, 
  GitCompare, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Table as TableIcon, 
  FileText, 
  ListChecks, 
  Quote, 
  Workflow, 
  Send,
  Flame
} from "lucide-react";
import { translations } from "../data/translations";
import { sampleTopics } from "../data/sampleTopics";
import { FanOutAnalysisResult, FollowUpQueryNode, ConversationStage, ContentFormat } from "../types";

interface FanOutMapperProps {
  lang: 'en' | 'fa';
  analysisResult: FanOutAnalysisResult | null;
  setAnalysisResult: (res: FanOutAnalysisResult | null) => void;
  onSendToSimulator: (query: string) => void;
}

export const FanOutMapper: React.FC<FanOutMapperProps> = ({
  lang,
  analysisResult,
  setAnalysisResult,
  onSendToSimulator,
}) => {
  const t = translations[lang];
  const isRtl = lang === "fa";

  const [seedQuery, setSeedQuery] = useState(
    analysisResult?.seedQuery || (lang === 'fa' ? "بهترین CRM برای استارتاپ‌ها" : "Best B2B CRM for remote teams")
  );
  const [brandName, setBrandName] = useState(analysisResult?.brandName || "");
  const [loading, setLoading] = useState(false);
  const [activeStageFilter, setActiveStageFilter] = useState<ConversationStage | "all">("all");
  const [viewMode, setViewMode] = useState<"cards" | "mindmap">("cards");

  React.useEffect(() => {
    if (analysisResult?.seedQuery) {
      setSeedQuery(analysisResult.seedQuery);
    }
  }, [analysisResult]);

  const handleRunAnalysis = async (queryToRun?: string, brandToRun?: string) => {
    const q = queryToRun || seedQuery;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/fanout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedQuery: q,
          brandName: brandToRun !== undefined ? brandToRun : brandName,
          language: lang,
        }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFormatBadge = (format: ContentFormat) => {
    switch (format) {
      case "table":
        return {
          label: lang === "fa" ? "جدول مقایسه‌ای" : "Comparison Table",
          icon: TableIcon,
          color: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "prose":
        return {
          label: lang === "fa" ? "پاسخ مستقیم (متن کوتاه)" : "Direct Concise Prose",
          icon: FileText,
          color: "bg-slate-100 text-slate-700 border-slate-200",
        };
      case "bullet_specs":
        return {
          label: lang === "fa" ? "فهرست بالت‌پوینت مشخصات" : "Bulleted Specs",
          icon: ListChecks,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "quote_proof":
        return {
          label: lang === "fa" ? "نقل‌قول و داده‌های اثباتی" : "Proof / Quote Box",
          icon: Quote,
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "step_by_step":
        return {
          label: lang === "fa" ? "راهنمای گام‌به‌گام" : "Step-by-Step Workflow",
          icon: Workflow,
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          label: format,
          icon: FileText,
          color: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  const stageMetadata: Record<
    ConversationStage,
    { title: string; desc: string; icon: any; accentColor: string; bgBadge: string }
  > = {
    clarification: {
      title: t.clarification,
      desc: t.clarificationDesc,
      icon: HelpCircle,
      accentColor: "text-sky-600",
      bgBadge: "bg-sky-50 text-sky-800 border-sky-200",
    },
    constraints: {
      title: t.constraints,
      desc: t.constraintsDesc,
      icon: Sliders,
      accentColor: "text-amber-600",
      bgBadge: "bg-amber-50 text-amber-800 border-amber-200",
    },
    comparison: {
      title: t.comparison,
      desc: t.comparisonDesc,
      icon: GitCompare,
      accentColor: "text-purple-600",
      bgBadge: "bg-purple-50 text-purple-800 border-purple-200",
    },
    validation: {
      title: t.validation,
      desc: t.validationDesc,
      icon: ShieldCheck,
      accentColor: "text-emerald-600",
      bgBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    action: {
      title: t.action,
      desc: t.actionDesc,
      icon: CheckCircle2,
      accentColor: "text-indigo-600",
      bgBadge: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero & Query Search Input */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search Engine Land Framework • Louisa Frahm</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === "fa"
              ? "موتور نقشه‌برداری سفر محاوره‌ای و شلیک‌های فرعی (Query Fan-Out)"
              : "Conversational Query Journey & Fan-Out Intelligence"}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none text-slate-400`}>
              <Search className="w-5 h-5 text-indigo-600" />
            </div>
            <input
              id="seed-query-input"
              type="text"
              value={seedQuery}
              onChange={(e) => setSeedQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunAnalysis()}
              placeholder={t.searchPlaceholder}
              className={`w-full h-12 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>

          <div className="md:col-span-4 flex gap-2">
            <input
              id="brand-name-input"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={t.brandPlaceholder}
              className="w-full h-12 bg-white border border-slate-300 rounded-xl px-3.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              id="run-analysis-btn"
              onClick={() => handleRunAnalysis()}
              disabled={loading}
              className="shrink-0 h-12 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">{lang === 'fa' ? 'تحلیل...' : 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.analyzeBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Sample Topics */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">
            {t.sampleTopicsTitle}
          </span>
          {sampleTopics.map((sample) => {
            const title = lang === "fa" ? sample.titleFa : sample.titleEn;
            const brand = lang === "fa" ? sample.brandFa : sample.brandEn;
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setSeedQuery(title);
                  if (brand) setBrandName(brand);
                  handleRunAnalysis(title, brand);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-indigo-700 transition-all cursor-pointer font-medium"
              >
                {title}
              </button>
            );
          })}
        </div>
      </section>

      {/* Loading State Skeleton */}
      {loading && (
        <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-base font-semibold text-slate-900">{t.analyzing}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {lang === "fa"
              ? "موتورهای جستجوی AI نظیر Google AI Overviews و Perplexity با تجزیه پرسش اولیه به شاخه‌های موازی، پاسخ را سنتز می‌کنند."
              : "Modeling Query Fan-Out branches across Clarification, Constraints, Comparisons, Validations, and Action."}
          </p>
        </div>
      )}

      {/* Results Section */}
      {!loading && analysisResult && (
        <div className="space-y-6">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Summary Card */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  {t.executiveSummary}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                  {lang === "fa" ? `${analysisResult.totalFollowUps || 15} کوئری کشف شد` : `${analysisResult.totalFollowUps || 15} Queries Mapped`}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysisResult.executiveSummary}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">
                  {t.keyEntities}:
                </span>
                {analysisResult.keyEntities?.map((entity, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                  >
                    #{entity}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Overview Trigger Gauge */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {t.overviewTriggerScore}
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {analysisResult.aiOverviewTriggerScore || 85}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-700 rounded-full"
                    style={{ width: `${analysisResult.aiOverviewTriggerScore || 85}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                  {lang === "fa"
                    ? "💡 نرخ بالای Fan-Out: موتور جستجوی هوش مصنوعی به جای یک صفحه تک، حداقل ۴ منبع مختلف در فرمت‌های جدول و نقل‌قول را برای این موضوع مقایسه می‌کند."
                    : "💡 High Fan-Out Propensity: AI search engines synthesize answers by cross-referencing multiple sub-topic documents simultaneously."}
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Filter & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-200 py-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs text-slate-500 font-medium px-1">
                {lang === "fa" ? "فیلتر فازها:" : "Filter Stages:"}
              </span>
              <button
                onClick={() => setActiveStageFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeStageFilter === "all"
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {lang === "fa" ? "تمام ۵ فاز" : "All 5 Stages"}
              </button>
              {(Object.keys(stageMetadata) as ConversationStage[]).map((stage) => {
                const meta = stageMetadata[stage];
                const isActive = activeStageFilter === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setActiveStageFilter(stage)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {meta.title}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setViewMode(viewMode === "cards" ? "mindmap" : "cards")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:border-slate-300 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Workflow className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {viewMode === "cards" 
                    ? (lang === "fa" ? "نمای نقشه درختی (Mindmap)" : "Mindmap Tree View")
                    : (lang === "fa" ? "نمای کارت‌های محتوایی" : "Content Cards View")}
                </span>
              </button>
            </div>
          </div>

          {/* MINDMAP / TREE VIEW */}
          {viewMode === "mindmap" && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 overflow-x-auto">
              <div className="min-w-[800px] flex flex-col items-center">
                {/* Seed Root Node */}
                <div className="p-4 rounded-xl bg-white border-2 border-indigo-500 text-center max-w-md shadow-sm mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    {lang === "fa" ? "کوئری هسته اولیه (Seed Prompt)" : "Seed Prompt"}
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    "{analysisResult.seedQuery}"
                  </p>
                </div>

                {/* Branches to 5 Stages */}
                <div className="grid grid-cols-5 gap-4 w-full">
                  {(Object.keys(stageMetadata) as ConversationStage[]).map((stage) => {
                    const meta = stageMetadata[stage];
                    const nodes: FollowUpQueryNode[] = analysisResult.stages[stage] || [];
                    return (
                      <div key={stage} className="flex flex-col items-center space-y-3">
                        <div className={`w-full p-2.5 rounded-xl border text-center font-semibold text-xs shadow-xs ${meta.bgBadge}`}>
                          {meta.title}
                        </div>
                        <div className="w-0.5 h-4 bg-slate-300" />
                        <div className="w-full space-y-2.5">
                          {nodes.map((node) => (
                            <div
                              key={node.id}
                              className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:border-indigo-300 hover:shadow-xs transition-all group"
                            >
                              <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {node.query}
                              </p>
                              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                <span>{node.citationLikelihood} Priority</span>
                                <button
                                  onClick={() => onSendToSimulator(node.query)}
                                  className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer font-semibold"
                                  title="Test in Simulator"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CARDS PIPELINE VIEW */}
          {viewMode === "cards" && (
            <div className="space-y-8">
              {(Object.keys(stageMetadata) as ConversationStage[])
                .filter((stage) => activeStageFilter === "all" || activeStageFilter === stage)
                .map((stage) => {
                  const meta = stageMetadata[stage];
                  const Icon = meta.icon;
                  const nodes: FollowUpQueryNode[] = analysisResult.stages[stage] || [];

                  return (
                    <div key={stage} className="space-y-3">
                      {/* Stage Heading */}
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${meta.bgBadge}`}>
                          <Icon className={`w-4 h-4 ${meta.accentColor}`} />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900">
                            {meta.title}
                          </h2>
                          <p className="text-xs text-slate-500">{meta.desc}</p>
                        </div>
                      </div>

                      {/* Stage Query Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nodes.map((node) => {
                          const formatInfo = getFormatBadge(node.recommendedFormat);
                          const FormatIcon = formatInfo.icon;
                          return (
                            <div
                              key={node.id}
                              className="rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs p-5 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                            >
                              <div>
                                {/* Header badges */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${formatInfo.color}`}>
                                    <FormatIcon className="w-3 h-3" />
                                    {formatInfo.label}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                                        node.citationLikelihood === "Critical"
                                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                                          : node.citationLikelihood === "High"
                                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                                          : "bg-slate-100 text-slate-600 border border-slate-200"
                                      }`}
                                    >
                                      {node.citationLikelihood} Citation
                                    </span>
                                  </div>
                                </div>

                                {/* Main follow up query */}
                                <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  "{node.query}"
                                </h3>
                                <p className="text-xs text-slate-600 mt-1">
                                  <span className="font-semibold text-slate-800">
                                    {lang === "fa" ? "قصد جستجو: " : "Intent: "}
                                  </span>
                                  {node.intent}
                                </p>

                                {/* Background Fan-Out Sub-Queries */}
                                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]">
                                  <div className="text-slate-600 font-sans font-semibold mb-1.5 flex items-center gap-1 text-[11px]">
                                    <Sparkles className="w-3 h-3 text-indigo-600" />
                                    <span>{t.fanOutSearches}</span>
                                  </div>
                                  <div className="space-y-1">
                                    {node.subQueries.map((sub, sIdx) => (
                                      <div key={sIdx} className="text-slate-700 flex items-start gap-1.5">
                                        <span className="text-indigo-500 select-none font-bold">↳</span>
                                        <span className="truncate">{sub}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Optimization Tip */}
                                <div className="mt-3 text-xs text-slate-700 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 leading-relaxed">
                                  <span className="font-semibold text-indigo-900 block mb-0.5">
                                    {t.contentTip}
                                  </span>
                                  {node.contentTip}
                                </div>
                              </div>

                              {/* Footer action */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">
                                  {t.difficulty} <strong className="text-slate-800">{node.difficulty}</strong>
                                </span>

                                <button
                                  onClick={() => onSendToSimulator(node.query)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                                >
                                  <span>{lang === "fa" ? "تست در شبیه‌ساز AI" : "Test in Simulator"}</span>
                                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
