import React from "react";
import { 
  Compass, 
  FileCheck2, 
  Bot, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Split, 
  Target, 
  Zap, 
  Search, 
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { sampleTopics, sampleDraftAuditContent } from "../data/sampleTopics";

interface OverviewHomeProps {
  lang: "en" | "fa";
  onNavigate: (tab: string, sampleTopic?: { title: string; brand?: string }) => void;
  onOpenHowItWorks: () => void;
}

export const OverviewHome: React.FC<OverviewHomeProps> = ({
  lang,
  onNavigate,
  onOpenHowItWorks,
}) => {
  const isRtl = lang === "fa";

  const workflowSteps = [
    {
      id: "fanout",
      stepNum: "01",
      title: lang === "fa" ? "۱. ترسیم سفر کوئری و Fan-Out" : "1. Map Query Fan-Out & Journey",
      subtitle: lang === "fa" ? "شناسایی سوالات بعدی و جستجوهای پنهان هوش مصنوعی" : "Discover user follow-ups & hidden AI sub-queries",
      icon: Compass,
      color: "from-indigo-600 to-blue-600",
      accentBg: "bg-indigo-50 border-indigo-100 text-indigo-700",
      buttonText: lang === "fa" ? "شروع با نقشه سفر" : "Explore Journey Mapper",
      whatItDoes: lang === "fa"
        ? "وقتی کاربری در هوش مصنوعی جستجو می‌کند، موتور AI پرامپت او را به ۴ تا ۶ جستجوی فرعی موازی (Query Fan-Out) می‌شکند. این بخش این شاخه‌ها و ۵ مرحله تعقیبی را ترسیم می‌کند."
        : "When someone queries an AI engine, it breaks the prompt into 4-6 parallel sub-searches (Query Fan-Out). This tool maps those hidden branches across 5 conversational stages.",
      benefit: lang === "fa" ? "خروجی: فهرست سوالات تعقیبی و نکات استناد" : "Deliverable: Roadmap of sub-searches & citation angles",
    },
    {
      id: "scorecard",
      stepNum: "02",
      title: lang === "fa" ? "۲. ممیزی محتوا و اسکورکارد" : "2. Audit Content & Scorecard",
      subtitle: lang === "fa" ? "سنجش آمادگی متن برای نقل‌قول و نمره سئو محاوره‌ای" : "AI Quotability audit, readiness score & instant fixes",
      icon: FileCheck2,
      color: "from-emerald-600 to-teal-600",
      accentBg: "bg-emerald-50 border-emerald-100 text-emerald-700",
      buttonText: lang === "fa" ? "ممیزی پیش‌نویس مقاله" : "Audit Article Content",
      whatItDoes: lang === "fa"
        ? "متن یا پیش‌نویس صفحه خود را وارد کنید تا بر اساس ۵ فاکتور کلیدی (تعاریف صریح، پاسخ به تردیدها، جداول مقایسه و داده‌های اثبات‌شده) ارزیابی شود."
        : "Paste your draft or webpage copy to get scored against the 5 criteria AI models look for when choosing which source to cite (direct definitions, friction answers, matrices).",
      benefit: lang === "fa" ? "خروجی: نمره از ۱۰۰ + اسنیپت‌های مارک‌داون آماده کپی" : "Deliverable: Score /100 + copy-paste markdown blocks",
    },
    {
      id: "simulator",
      stepNum: "03",
      title: lang === "fa" ? "۳. شبیه‌ساز زنده جستجوی هوش مصنوعی" : "3. Live AI Search Simulator",
      subtitle: lang === "fa" ? "مشاهده رفتار بلادرنگ Perplexity و Google AI Mode" : "Emulate multi-turn conversations & terminal logs",
      icon: Bot,
      color: "from-purple-600 to-violet-600",
      accentBg: "bg-purple-50 border-purple-100 text-purple-700",
      buttonText: lang === "fa" ? "تست در شبیه‌ساز هوش مصنوعی" : "Test Live Simulator",
      whatItDoes: lang === "fa"
        ? "در یک محیط تعاملی، مانند Perplexity با هوش مصنوعی گفتگو کنید، کوئری‌های فرعی که در پس‌زمینه اجرا می‌شوند را در ترمینال شبیه‌ساز ببینید و منابع استنادشده را بررسی کنید."
        : "Interact in a multi-turn chat like Perplexity, inspect the background sub-queries in the live simulation terminal, and see how sources get cited dynamically.",
      benefit: lang === "fa" ? "خروجی: درک عملی چگونگی استخراج پاسخ توسط هوش مصنوعی" : "Deliverable: Deep visibility into AI answer synthesis",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200 text-indigo-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {lang === "fa" 
                ? "نسل نوین سئو برای موتورهای جستجوی هوش مصنوعی (GEO)" 
                : "Next-Gen Conversational Generative Engine Optimization (GEO)"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display leading-tight">
            {lang === "fa" ? (
              <>
                راهنمای شروع: این پلتفرم <span className="text-indigo-600">چه می‌کند</span> و چگونه از آن استفاده کنیم؟
              </>
            ) : (
              <>
                Decode How AI Searches, <span className="text-indigo-600">Audit Your Content</span>, and Get Cited.
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {lang === "fa" ? (
              <>
                در دوران موتورهای سنتی، سئو یعنی رتبه‌بندی برای یک کلمه کلیدی تک. اما امروزه در <strong>Google AI Overviews، ChatGPT Search و Perplexity</strong>، کاربران وارد یک گفتگوی چندمرحله‌ای می‌شوند و موتور هوش مصنوعی با تکنیک <strong>Query Fan-Out</strong> یک پرامپت را به چندین جستجوی همزمان در پس‌زمینه تقسیم می‌کند.
                <br className="hidden sm:inline" />
                این اپلیکیشن این فرآیند را برای شما شفاف می‌کند، به محتوایتان نمره می‌دهد و نشان می‌دهد چگونه منبع مورد استناد هوش مصنوعی شوید.
              </>
            ) : (
              <>
                Traditional SEO targeted single static keywords. Today in <strong>Google AI Overviews, Perplexity, and ChatGPT Search</strong>, users conduct multi-turn conversational journeys, while AI engines execute invisible background sub-searches (<strong>Query Fan-Out</strong>). 
                <br className="hidden sm:inline" />
                This suite visualizes that journey, audits your content against quotation readiness, and provides copy-paste blueprints.
              </>
            )}
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("fanout")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <span>{lang === "fa" ? "۱. شروع با نقشه مسیر کوئری (Fan-Out)" : "1. Start with Query Fan-Out"}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </button>

            <button
              onClick={() => onNavigate("scorecard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-all shadow-2xs cursor-pointer"
            >
              <span>{lang === "fa" ? "۲. ممیزی پیش‌نویس مقاله (Scorecard)" : "2. Audit an Article Draft"}</span>
            </button>

            <button
              onClick={onOpenHowItWorks}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{lang === "fa" ? "راهنمای کار با برنامه (How It Works)" : "How It Works Guide"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Interactive "Choose Your Immediate Goal" */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>{lang === "fa" ? "هدف فعلی شما چیست؟ از کجا شروع کنید؟" : "What is your immediate goal? Choose where to start:"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "fa" 
                ? "بر اساس سناریوی کاری خود، روی یکی از مسیرهای زیر کلیک کنید تا مستقیماً به ابزار مربوطه هدایت شوید."
                : "Select your workflow scenario to jump directly to the right tool."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Goal 1 */}
          <div 
            onClick={() => onNavigate("fanout")}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                {lang === "fa" ? "می‌خواهم مقاله جدید بنویسم" : "Planning a new article"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "fa" 
                  ? "کلمه کلیدی حوزه خود را وارد کنید تا ببینید کاربران چه سوالات تعقیبی می‌پرسند و هوش مصنوعی چه جستجوهایی در پس‌زمینه انجام می‌دهد."
                  : "Discover follow-up inquiries and background AI sub-queries to structure a multi-turn comprehensive article."}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>{lang === "fa" ? "ورود به نقشه کوئری" : "Launch Fan-Out Mapper"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ml-1 ${isRtl ? "rotate-180 mr-1 ml-0" : ""}`} />
            </div>
          </div>

          {/* Goal 2 */}
          <div 
            onClick={() => onNavigate("scorecard")}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors">
                {lang === "fa" ? "مقاله آماده یا منتشرشده دارم" : "I have published content"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "fa"
                  ? "متن خود را ارزیابی کنید تا نمره نقل‌قول هوش مصنوعی، خطاهای ساختاری و اسنیپت‌های اصلاحی آماده کپی را دریافت کنید."
                  : "Paste your text to test if AI engines can quote it. Get an instant /100 score and copy-paste markdown fixes."}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>{lang === "fa" ? "ورود به اسکورکارد" : "Run Content Audit"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ml-1 ${isRtl ? "rotate-180 mr-1 ml-0" : ""}`} />
            </div>
          </div>

          {/* Goal 3 */}
          <div 
            onClick={() => onNavigate("simulator")}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-purple-600 transition-colors">
                {lang === "fa" ? "می‌خواهم هوش مصنوعی را تست کنم" : "Test real AI search behavior"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "fa"
                  ? "یک کوئری بپرسید تا ببینید هوش مصنوعی چطور در پس‌زمینه آن را به چند سرچ فرعی می‌شکند و به چه منابعی استناد می‌کند."
                  : "Ask questions in a live multi-turn emulator and inspect the query fan-out terminal and cited domains."}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>{lang === "fa" ? "ورود به شبیه‌ساز" : "Open AI Simulator"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ml-1 ${isRtl ? "rotate-180 mr-1 ml-0" : ""}`} />
            </div>
          </div>

          {/* Goal 4 */}
          <div 
            onClick={() => onNavigate("brief")}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-600 transition-colors">
                {lang === "fa" ? "بریف آماده برای نویسنده می‌خواهم" : "Export editorial content brief"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === "fa"
                  ? "طرح کامل تولید محتوا بر اساس عناوین H2/H3، جداول مقایسه‌ای و الزامات استناد هوش مصنوعی در فرمت مارک‌داون."
                  : "Ready-to-use editorial outline with H2/H3 hierarchy, comparison tables, and AI citation requirements."}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>{lang === "fa" ? "مشاهده بریف آماده" : "View Content Brief"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ml-1 ${isRtl ? "rotate-180 mr-1 ml-0" : ""}`} />
            </div>
          </div>

        </div>
      </section>

      {/* 3. The 3-Step Systematic Workflow */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>{lang === "fa" ? "گردش کار ۳ مرحله‌ای ابزار (چگونه کار می‌کند؟)" : "The 3-Step Optimization System"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "fa"
              ? "این سه ابزار به صورت یکپارچه با یکدیگر همکاری می‌کنند تا محتوای شما در تمام مراحل سفر محاوره‌ای پوشش داده شود."
              : "How the modules connect to transform your content into the authoritative AI citation."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-slate-300 font-mono">
                      {step.stepNum}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${step.accentBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.whatItDoes}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="text-[11px] font-medium text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-150">
                    {step.benefit}
                  </div>
                  <button
                    onClick={() => onNavigate(step.id)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{step.buttonText}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Traditional Search vs Conversational AI Search (Mental Model Shift) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === "fa" ? "تغییر پارادایم در جستجو" : "The Core Shift in Search"}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {lang === "fa" 
              ? "سئوی سنتی (۱۰ لینک آبی) در برابر سئوی محاوره‌ای هوش مصنوعی (Query Fan-Out)" 
              : "Traditional Keyword Search vs. Conversational AI Search"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "fa"
              ? "چرا دیگر بهینه‌سازی صرفاً برای یک کلمه کلیدی کافی نیست؟"
              : "Why optimizing for a single static keyword is no longer enough in 2026."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Old Traditional SEO */}
          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                {lang === "fa" ? "مدل سنتی (سئو ۱.۰)" : "Traditional Model (SEO 1.0)"}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-semibold">
                Single-Turn
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{lang === "fa" ? "کاربر ۱ عبارت تایپ می‌کند («بهترین کتانی رانینگ»)." : "User inputs 1 keyword phrase ('best running shoes')."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{lang === "fa" ? "گوگل ۱۰ لینک آبی نمایش می‌دهد؛ کاربر یکی را باز می‌کند." : "Search engine displays 10 blue links; user clicks one."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{lang === "fa" ? "ملاک موفقیت: چگالی کلمات، بک‌لینک و تگ عنوان." : "Focus: Keyword density, static backlinks, and meta tags."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{lang === "fa" ? "شکست در پاسخ‌دهی: اگر کاربر سوال بعد را بپرسد، از صفحه شما خارج می‌شود." : "Failure mode: When users have follow-ups, they leave your page."}</span>
              </li>
            </ul>
          </div>

          {/* New Conversational Search */}
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {lang === "fa" ? "مدل مدرن هوش مصنوعی (GEO & Fan-Out)" : "Modern AI Search (GEO & Fan-Out)"}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                Multi-Turn & Sub-Searches
              </span>
            </div>

            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === "fa" ? "کاربر سناریوی کامل را شرح می‌دهد و سوالات تعقیبی می‌پرسد." : "User describes a full scenario and asks immediate follow-up questions."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === "fa" ? "هوش مصنوعی همزمان ۴ الی ۶ جستجوی پس‌زمینه (Query Fan-Out) انجام می‌دهد." : "AI engine automatically executes 4 to 6 parallel sub-queries behind the scenes."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === "fa" ? "ملاک موفقیت: تعاریف صریح و کوتاه، جداول مقایسه‌ای و اثبات اجتماعی (Reddit)." : "Focus: Concise 1-2 sentence answers, comparison tables, and Reddit proof."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{lang === "fa" ? "پیروزی: هوش مصنوعی متن شما را نقل‌قول و دامنه شما را ارجاع می‌دهد." : "Winning outcome: AI directly cites and links your website in the summary."}</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Quick Exploration Presets (Instant 1-Click Demo) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>{lang === "fa" ? "تست سریع با موضوعات آماده (۱ کلیک برای شروع)" : "Quick Exploration Presets (1-Click Instant Demo)"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "fa"
              ? "روی هر یک از موضوعات زیر کلیک کنید تا بلافاصله نقشه سفر و کوئری‌های فرعی آن را در ابزار مشاهده کنید:"
              : "Click any pre-loaded topic below to immediately run the analysis and see the live breakdown:"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleTopics.map((topic) => {
            const title = lang === "fa" ? topic.titleFa : topic.titleEn;
            const brand = lang === "fa" ? topic.brandFa : topic.brandEn;
            return (
              <button
                key={topic.id}
                onClick={() => onNavigate("fanout", { title, brand })}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">
                    {topic.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {title}
                  </h4>
                  {brand && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {lang === "fa" ? "برند هدف:" : "Target:"} {brand}
                    </p>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                  <span>{lang === "fa" ? "مشاهده تحلیل" : "Analyze Topic"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 6. The 5 Follow-Up Stages Taxonomy Summary */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>{lang === "fa" ? "فریم‌ورک ۵ مرحله‌ای لوئیزا فرام در یک نگاه:" : "The 5-Stage Follow-Up Taxonomy at a Glance"}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "fa" 
              ? "موتورهای هوش مصنوعی سفر کاربر را در این ۵ دسته سازمان‌دهی می‌کنند. محتوای شما باید برای هر ۵ مرحله آماده باشد:"
              : "How searchers and AI models progress from initial inquiry to final decision:"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 block">۱. Clarification</span>
            <div className="text-xs font-semibold text-slate-900">{lang === "fa" ? "شفاف‌سازی" : "Definition"}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "fa" ? "تعاریف صریح و کوتاه برای نقل‌قول مستقیم" : "Concise 1-2 sentence definitions"}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 block">۲. Constraints</span>
            <div className="text-xs font-semibold text-slate-900">{lang === "fa" ? "قیدها و محدودیت‌ها" : "Constraints"}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "fa" ? "بودجه، پلتفرم، نیازمندی‌ها و فیلترها" : "Budgets, team limits, requirements"}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-purple-700 block">۳. Comparison</span>
            <div className="text-xs font-semibold text-slate-900">{lang === "fa" ? "مقایسه گزینه‌ها" : "Comparison"}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "fa" ? "جداول مقایسه‌ای ماتریسی X در برابر Y" : "Direct side-by-side feature matrices"}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 block">۴. Validation</span>
            <div className="text-xs font-semibold text-slate-900">{lang === "fa" ? "اثبات و اعتبارسنجی" : "Validation"}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "fa" ? "نظرات کاربران ردیت، بنچمارک‌ها و ریسک‌ها" : "Reddit reviews, risks, customer proof"}
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-rose-700 block">۵. Action</span>
            <div className="text-xs font-semibold text-slate-900">{lang === "fa" ? "اقدام و تصمیم" : "Decision & Action"}</div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {lang === "fa" ? "قیمت‌گذاری شفاف، مراحل راه‌اندازی و ROI" : "Transparent pricing, onboarding steps"}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
