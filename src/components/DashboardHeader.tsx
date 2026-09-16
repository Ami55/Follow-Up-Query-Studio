import React from "react";
import { translations } from "../data/translations";
import { 
  Home,
  Menu, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  FileCheck2, 
  Bot, 
  FileText, 
  BookOpen 
} from "lucide-react";

interface DashboardHeaderProps {
  currentTab: string;
  lang: 'en' | 'fa';
  onOpenHowItWorks: () => void;
  onToggleSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTab,
  lang,
  onOpenHowItWorks,
  onToggleSidebar,
}) => {
  const t = translations[lang];

  const tabMeta: Record<string, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    overview: {
      title: t.tabOverview,
      subtitle: lang === "fa" ? "نمای کلی پلتفرم، راهنمای شروع کار و مقایسه سئو با جستجوی هوش مصنوعی" : "Platform overview, workflow guide, and GEO mental model",
      icon: Home,
    },
    fanout: {
      title: t.tabFanOut,
      subtitle: lang === "fa" ? "ترسیم ۵ مرحله تعقیبی و کوئری‌های فرعی در پس‌زمینه هوش مصنوعی" : "5-stage multi-turn query roadmap & background sub-searches",
      icon: Compass,
    },
    scorecard: {
      title: t.tabScorecard,
      subtitle: lang === "fa" ? "ممیزی آمادگی نقل‌قول، محاسبه امتیاز سئو و اسنیپت‌های اصلاحی" : "Content quotability audit, GEO readiness score & markdown fixes",
      icon: FileCheck2,
    },
    simulator: {
      title: t.tabSimulator,
      subtitle: lang === "fa" ? "شبیه‌سازی زنده رفتار Perplexity و Google AI Overviews با ترمینال زیرکوئری‌ها" : "Live emulation of AI search engine query fan-out behavior",
      icon: Bot,
    },
    brief: {
      title: t.tabBrief,
      subtitle: lang === "fa" ? "طرح جامع تولید محتوا استاندارد در فرمت مارک‌داون" : "Standardized multi-turn content architecture brief (.MD)",
      icon: FileText,
    },
    guide: {
      title: t.tabGuide,
      subtitle: lang === "fa" ? "مستندات و بررسی تحلیل لوئیزا فرام در Search Engine Land" : "Louisa Frahm's framework analysis and taxonomy reference",
      icon: BookOpen,
    },
  };

  const current = tabMeta[currentTab] || tabMeta.fanout;
  const TabIcon = current.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Trigger + Page Title Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="hidden sm:flex w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 items-center justify-center text-indigo-600 shrink-0">
              <TabIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {current.title}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="header-how-it-works-btn"
            onClick={onOpenHowItWorks}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 transition-colors cursor-pointer shadow-2xs"
            title={lang === "fa" ? "راهنمای کار با برنامه" : "How It Works Guide"}
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">
              {lang === "fa" ? "راهنمای کار با برنامه" : "How It Works"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
