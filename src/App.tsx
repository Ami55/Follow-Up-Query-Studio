import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { OverviewHome } from "./components/OverviewHome";
import { FanOutMapper } from "./components/FanOutMapper";
import { ScorecardAuditor } from "./components/ScorecardAuditor";
import { AiSearchSimulator } from "./components/AiSearchSimulator";
import { ArticleGuide } from "./components/ArticleGuide";
import { ContentBriefView } from "./components/ContentBriefView";
import { HowItWorksModal } from "./components/HowItWorksModal";
import { FanOutAnalysisResult, AuditResult } from "./types";
import { translations } from "./data/translations";
import { sampleDraftAuditContent } from "./data/sampleTopics";
import { HelpCircle, ArrowRight, Sparkles } from "lucide-react";

export default function App() {
  const [lang] = useState<'fa' | 'en'>('en');
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [analysisResult, setAnalysisResult] = useState<FanOutAnalysisResult | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [simulatorQuery, setSimulatorQuery] = useState<string>("");
  const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const t = translations[lang];
  const isRtl = lang === "fa";

  // Pre-load default analysis on initial launch for immediate responsiveness
  useEffect(() => {
    const initialQuery = lang === 'fa' 
      ? "بهترین نرم‌افزار CRM برای استارتاپ‌ها" 
      : "Best B2B CRM for remote teams";
    
    fetch("/api/fanout/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seedQuery: initialQuery,
        language: lang,
      }),
    })
      .then((res) => res.json())
      .then((data) => setAnalysisResult(data))
      .catch((err) => console.error("Initial load error:", err));
  }, [lang]);

  const handleSendToSimulator = (query: string) => {
    setSimulatorQuery(query);
    setCurrentTab("simulator");
  };

  const handleNavigateFromOverview = (tab: string, sampleTopic?: { title: string; brand?: string }) => {
    if (sampleTopic) {
      fetch("/api/fanout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedQuery: sampleTopic.title,
          brand: sampleTopic.brand || "",
          language: lang,
        }),
      })
        .then((res) => res.json())
        .then((data) => setAnalysisResult(data))
        .catch((err) => console.error("Sample generate error:", err));
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900 flex ${
        isRtl ? "font-['Vazirmatn',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
    >
      {/* Left Sidebar Menu */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* How It Works Modal (What to provide, what to expect, what it solves) */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
        lang={lang}
      />

      {/* Main Dashboard Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 min-h-screen">
        {/* Sticky Dashboard Topbar */}
        <DashboardHeader
          currentTab={currentTab}
          lang={lang}
          onOpenHowItWorks={() => setHowItWorksOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {/* Quick How It Works Callout Banner for sub-tools */}
          {currentTab !== "overview" && (
            <div className="mb-6 rounded-2xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-indigo-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>
                      {lang === "fa" 
                        ? "راهنمای کار با ابزار: چه مشکلی حل می‌شود و چه ورودی‌هایی نیاز است؟" 
                        : "How It Works: What this solves, what to provide & what to expect"}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                    {lang === "fa" 
                      ? "این ابزار به شما کمک می‌کند متوجه شوید موتورهای هوش مصنوعی (Google AI و Perplexity) چه سوالات تعقیبی از طرف کاربران مطرح می‌کنند و محتوای شما باید چه بخش‌هایی داشته باشد تا نقل‌قول شود. برای شروع کافیست یک کلمه کلیدی یا پیش‌نویس متنتان را وارد کنید."
                      : "Discover exactly what follow-up questions AI search engines ask on behalf of users and what sections your content must include to get cited. Enter a seed keyword or paste draft content to begin."}
                  </p>
                </div>
              </div>
              <button
                id="how-it-works-banner-btn"
                onClick={() => setHowItWorksOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs cursor-pointer"
              >
                <span>{lang === "fa" ? "راهنمای کار با برنامه (How It Works)" : "How It Works Guide"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {currentTab === "overview" && (
            <OverviewHome
              lang={lang}
              onNavigate={handleNavigateFromOverview}
              onOpenHowItWorks={() => setHowItWorksOpen(true)}
            />
          )}

          {currentTab === "fanout" && (
            <FanOutMapper
              lang={lang}
              analysisResult={analysisResult}
              setAnalysisResult={setAnalysisResult}
              onSendToSimulator={handleSendToSimulator}
            />
          )}

          {currentTab === "scorecard" && (
            <ScorecardAuditor
              lang={lang}
              auditResult={auditResult}
              setAuditResult={setAuditResult}
              defaultTopic={analysisResult?.seedQuery}
            />
          )}

          {currentTab === "simulator" && (
            <AiSearchSimulator
              lang={lang}
              initialQuery={simulatorQuery}
              topicContext={analysisResult?.seedQuery}
            />
          )}

          {currentTab === "brief" && (
            <ContentBriefView
              lang={lang}
              analysisResult={analysisResult}
              onGoToFanOut={() => setCurrentTab("fanout")}
            />
          )}

          {currentTab === "guide" && (
            <ArticleGuide lang={lang} />
          )}
        </main>

        {/* Footer matching exact requested branding & credit badge */}
        <footer className="border-t border-slate-200 bg-white py-6 text-xs sm:text-sm text-slate-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-700 font-normal">
              <span>© 2026 Follow-Up Query Studio. Developed by</span>
              <span className="font-semibold text-teal-600">
                <strong>SEO Girl - Ami</strong>.
              </span>
              <span>All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <button
                onClick={() => setHowItWorksOpen(true)}
                className="hover:text-indigo-600 font-medium transition-colors cursor-pointer"
              >
                {lang === "fa" ? "راهنمای کار با برنامه (How It Works)" : "How It Works Guide"}
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentTab("guide")}
                className="hover:text-indigo-600 font-medium transition-colors cursor-pointer"
              >
                {lang === "fa" ? "تحلیل مقاله Search Engine Land" : "Search Engine Land Article"}
              </button>
              <span>•</span>
              <span>Framework by Louisa Frahm</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
