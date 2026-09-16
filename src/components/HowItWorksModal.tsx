import React from "react";
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Compass,
  Bot
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "fa";
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isRtl = lang === "fa";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === "fa" ? "راهنمای کار با برنامه (How It Works)" : "How It Works: Quick User Guide"}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "fa" 
                  ? "این اپلیکیشن چه مشکلی را حل می‌کند، چه ورودی‌هایی باید بدهید و چه انتظاری داشته باشید" 
                  : "What problem this solves, what inputs you provide, and what results to expect"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          
          {/* 1. What problem does this app solve? */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm sm:text-base">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>
                {lang === "fa" 
                  ? "۱. این اپلیکیشن چه مشکلی را برای شما حل می‌کند؟" 
                  : "1. What problem does this app solve?"}
              </span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {lang === "fa" ? (
                <>
                  در گذشته، سئو فقط رتبه‌بندی برای یک کلمه کلیدی بود. اما امروزه کاربران در <strong>Google AI Overviews، ChatGPT Search و Perplexity</strong> یک سوال می‌پرسند و بلافاصله سوالات بعدی را مطرح می‌کنند (مثل: «ارزان‌ترینش چیه؟»، «در مقایسه با رقیب چطوره؟»، «نظرات واقعی کاربران چیه؟»). موتورهای هوش مصنوعی هم همزمان چندین جستجوی فرعی در پس‌زمینه اجرا می‌کنند.
                  <br /><br />
                  <strong>این برنامه حل می‌کند:</strong> دیگر لازم نیست حدس بزنید هوش مصنوعی چه سوالاتی می‌پرسد یا چرا مقاله‌تان را نقل‌قول نمی‌کند. این اپلیکیشن به شما دقیقاً نشان می‌دهد چه بخش‌هایی در محتوایتان کم است تا سایت شما به منبع شماره ۱ و مورد استناد هوش مصنوعی تبدیل شود.
                </>
              ) : (
                <>
                  Traditional SEO focused on ranking for a single static keyword. Today, searchers on <strong>Google AI Overviews, ChatGPT Search, and Perplexity</strong> ask multi-turn questions ("Which is cheaper?", "Compare X vs Y", "What are real user complaints?"). 
                  <br /><br />
                  <strong>This app solves that blind spot:</strong> You no longer have to guess what background sub-searches AI runs or why your content isn't cited. It visualizes the follow-up queries, audits your content, and provides exact snippets to guarantee your brand gets quoted.
                </>
              )}
            </p>
          </div>

          {/* 2. What you should provide (Inputs) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>
                {lang === "fa" 
                  ? "۲. چه اطلاعاتی باید وارد کنید؟ (ورودی‌ها)" 
                  : "2. What you should provide (Inputs)"}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    {lang === "fa" ? "برای نقشه مسیر کوئری" : "For Query Journey"}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {lang === "fa" ? (
                    <>فقط <strong>یک کلمه کلیدی یا موضوع اصلی</strong> (مثلاً: «خرید لپ‌تاپ برنامه‌نویسی») + نام اختیاری برندتان را تایپ کنید.</>
                  ) : (
                    <>Type just <strong>one primary topic/keyword</strong> (e.g. "CRM software for startups") + optional brand name.</>
                  )}
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    {lang === "fa" ? "برای ارزیابی و اسکورکارد" : "For Scorecard Audit"}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {lang === "fa" ? (
                    <><strong>موضوع صفحه</strong> به همراه <strong>متن مقاله یا پیش‌نویس محتوایتان</strong> را وارد کنید (یا روی دکمه «بارگذاری متن نمونه» بزنید).</>
                  ) : (
                    <>Enter your <strong>target keyword</strong> and paste your <strong>article draft/copy</strong> (or click 'Load Sample Draft').</>
                  )}
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    {lang === "fa" ? "برای شبیه‌ساز هوش مصنوعی" : "For AI Simulator"}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {lang === "fa" ? (
                    <><strong>هر سوال محاوره‌ای</strong> که یک مشتری ممکن است بپرسد را بنویسید یا از گزینه‌های پیشنهادی آماده استفاده کنید.</>
                  ) : (
                    <>Type <strong>any conversational question</strong> a customer might ask, or click any auto-suggested follow-up chip.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 3. What to expect (Outputs & Results) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === "fa" 
                  ? "۳. چه خروجی و نتایجی دریافت خواهید کرد؟ (انتظارات)" 
                  : "3. What to expect (Outputs & Deliverables)"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    {lang === "fa" ? "نقشه ۵ مرحله‌ای سوالات بعدی کاربران" : "5-Stage Follow-Up Journey Map"}
                  </strong>
                  <span className="text-slate-600 leading-normal">
                    {lang === "fa"
                      ? "مشاهده دقیق سوالات تعقیبی، جستجوهای پس‌زمینه هوش مصنوعی و فرمت مناسب پاسخ (تعریف، جدول مقایسه، آمار)."
                      : "Visual roadmap of user follow-ups, background sub-queries, and best response formats."}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    {lang === "fa" ? "نمره آمادگی استناد هوش مصنوعی (از ۱۰۰)" : "AI Citation Score (/100) & Grade"}
                  </strong>
                  <span className="text-slate-600 leading-normal">
                    {lang === "fa"
                      ? "بررسی اینکه آیا متن شما جملات شفاف، پاسخ به ابهامات، جدول مقایسه‌ای و داده‌های قابل استناد دارد یا خیر."
                      : "Audit score analyzing direct definitions, friction handling, comparison tables, and quotability."}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    {lang === "fa" ? "قطعه کدهای آماده کپی برای رفع نواقص" : "Copy-Paste Snippets to Fix Gaps"}
                  </strong>
                  <span className="text-slate-600 leading-normal">
                    {lang === "fa"
                      ? "اسنیپت‌های مارک‌داون آماده برای کپی کردن مستقیم در محتوای سایتتان جهت پوشش دادن شکاف‌های شناسایی‌شده."
                      : "Auto-generated Markdown blocks ready to paste directly into your CMS or article draft."}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    {lang === "fa" ? "طرح جامع تولید محتوا (Content Brief)" : "Exportable Content Blueprint (.MD)"}
                  </strong>
                  <span className="text-slate-600 leading-normal">
                    {lang === "fa"
                      ? "یک بریف ساختاریافته کامل برای تحویل به نویسنده محتوا شامل عناوین H2/H3 و چک‌لیست‌های لازم."
                      : "A complete writer brief with structured H2/H3 headers, matrices, and quotation tips."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick 3-Step Summary */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
            <strong className="text-slate-900 block">
              {lang === "fa" ? "چگونه در ۳ مرحله شروع کنید؟" : "How to start in 3 simple steps:"}
            </strong>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>
                {lang === "fa" 
                  ? "در تب اول، موضوع مورد نظرتان را جستجو کنید تا نقشه ۵ گانه و کوئری‌های فرعی ساخته شود."
                  : "Search your topic in Tab 1 to generate the 5-stage journey and background fan-out queries."}
              </li>
              <li>
                {lang === "fa"
                  ? "به تب دوم رفته و متن خود را ارزیابی کنید تا نقاط ضعف و نمره استناد را ببینید."
                  : "Head to Tab 2 and audit your draft content to view missing gaps and citation scores."}
              </li>
              <li>
                {lang === "fa"
                  ? "اسنیپت‌های تولیدشده یا بریف نهایی تب چهارم را در سایت خود اعمال کنید."
                  : "Apply the generated snippets or export the complete brief from Tab 4 into your content workflow."}
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {lang === "fa" ? "برای شروع، این پنجره را ببندید و کلیدواژه خود را وارد کنید" : "Close this window to begin with your search query"}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            {lang === "fa" ? "شروع به کار" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};
