import React from "react";
import { translations } from "../data/translations";
import { 
  Home,
  Compass, 
  FileCheck2, 
  Bot, 
  BookOpen, 
  FileText, 
  Sparkles, 
  HelpCircle,
  X,
  Layers,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'fa';
  onOpenHowItWorks: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  onOpenHowItWorks,
  isOpenMobile,
  onCloseMobile,
}) => {
  const t = translations[lang];

  const primaryNavItems = [
    {
      id: "overview",
      label: t.tabOverview,
      icon: Home,
      desc: lang === "fa" ? "نمای کلی، راهنما و مسیر شروع" : "Overview, Guide & Workflows",
    },
    {
      id: "fanout",
      label: t.tabFanOut,
      icon: Compass,
      desc: lang === "fa" ? "نقشه ۵ مرحله‌ای و کوئری‌های فرعی" : "5-Stage Journey & Sub-Queries",
    },
    {
      id: "scorecard",
      label: t.tabScorecard,
      icon: FileCheck2,
      desc: lang === "fa" ? "ارزیابی نقل‌قول و نمره سئو محاوره‌ای" : "AI Quotability Audit & Score",
    },
    {
      id: "simulator",
      label: t.tabSimulator,
      icon: Bot,
      desc: lang === "fa" ? "شبیه‌ساز رفتار Perplexity و AI Search" : "Live Multi-Turn Search Emulator",
    },
    {
      id: "brief",
      label: t.tabBrief,
      icon: FileText,
      desc: lang === "fa" ? "طرح جامع مارک‌داون برای نویسنده" : "Ready-to-Use Markdown Outline",
    },
  ];

  const secondaryNavItems = [
    {
      id: "guide",
      label: t.tabGuide,
      icon: BookOpen,
      desc: lang === "fa" ? "تحلیل مقاله و فریم‌ورک لوئیزا فرام" : "Louisa Frahm's Taxonomy Guide",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Left Sidebar */}
      <aside
        id="app-left-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-sm shadow-indigo-600/25 flex items-center justify-center text-white shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                  Follow-Up Query
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {lang === "fa" ? "سئوی محاوره‌ای و ممیزی هوش مصنوعی" : "Conversational Search Engine"}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          
          {/* Main Navigation Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "fa" ? "ابزارهای تحلیل و بهینه‌سازی" : "Optimization Suite"}
            </div>
            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                      isActive
                        ? "bg-indigo-50 border border-indigo-200/80 text-indigo-950 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isActive 
                          ? "bg-indigo-600 text-white shadow-xs" 
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-start">
                        <div className="text-xs font-bold truncate leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Reference & Knowledge Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "fa" ? "مستندات و مرجع علمی" : "Research & Reference"}
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                      isActive
                        ? "bg-indigo-50 border border-indigo-200/80 text-indigo-950 font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isActive 
                          ? "bg-indigo-600 text-white shadow-xs" 
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 text-start">
                        <div className="text-xs font-bold truncate leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* How It Works Action Card */}
          <div className="p-3.5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-slate-50 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>{lang === "fa" ? "راهنمای کار با برنامه" : "How It Works"}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {lang === "fa" 
                ? "مشاهده ورودی‌های لازم، خروجی‌ها و نحوه بهینه‌سازی محتوا برای هوش مصنوعی."
                : "Learn what to provide, what to expect, and how to get quoted in AI search."}
            </p>
            <button
              id="sidebar-how-it-works-btn"
              onClick={() => {
                onOpenHowItWorks();
                onCloseMobile();
              }}
              className="w-full py-1.5 px-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{lang === "fa" ? "مشاهده راهنما" : "Open Guide"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {/* Developer Credit Tag */}
          <div className="text-[11px] text-slate-500 leading-tight">
            <span>Developed by </span>
            <span className="font-semibold text-teal-600">Ami - SEO Girl.</span>
          </div>
        </div>
      </aside>
    </>
  );
};
