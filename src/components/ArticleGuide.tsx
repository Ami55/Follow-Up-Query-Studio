import React, { useState } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Compass, 
  CheckCircle2, 
  Table, 
  Network, 
  Share2, 
  Wrench, 
  Award,
  ChevronRight
} from "lucide-react";
import { translations } from "../data/translations";

interface ArticleGuideProps {
  lang: 'en' | 'fa';
}

export const ArticleGuide: React.FC<ArticleGuideProps> = ({ lang }) => {
  const t = translations[lang];
  const isRtl = lang === "fa";
  const [activeSection, setActiveSection] = useState<string>("summary");

  const sections = [
    { id: "summary", title: lang === "fa" ? "خلاصه و پیام کلیدی مقاله" : "Executive Summary & Paradigm Shift" },
    { id: "fanout", title: lang === "fa" ? "مفهوم Query Fan-Out چیست؟" : "What is Query Fan-Out?" },
    { id: "taxonomy", title: lang === "fa" ? "دسته‌بندی ۵ گانه کوئری‌های تعقیبی" : "5-Stage Follow-Up Taxonomy" },
    { id: "scorecard", title: lang === "fa" ? "امتیازسنج سئو محاوره‌ای (Scorecard)" : "Conversational Search Scorecard" },
    { id: "tools", title: lang === "fa" ? "ابزارهای فعال بازار (Tools Landscape)" : "Market Tools Landscape" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search Engine Land Analysis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.articleDeepDiveTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            {lang === "fa"
              ? "تحلیل جامع مقاله لوئیزا فرام با عنوان «The follow-up query: Rethinking SEO for conversational search» و راهنمای عملی ساخت اپلیکیشن‌ها و استراتژی‌های جدید بر پایه آن."
              : "Comprehensive breakdown of Louisa Frahm's landmark Search Engine Land article and how it reshapes modern SEO into multi-turn GEO."}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span><strong className="text-slate-700">Author:</strong> Louisa Frahm</span>
            <span><strong className="text-slate-700">Editor:</strong> Angel Niñofranco</span>
            <span><strong className="text-slate-700">Reviewer:</strong> Danny Goodwin</span>
            <a
              href="https://searchengineland.com/the-follow-up-query-rethinking-seo-for-conversational-search-488537"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium ml-auto"
            >
              <span>{lang === "fa" ? "مشاهده مقاله اصلی" : "View Original Article"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Guide Content Layout: Sidebar + Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sticky top-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-3 py-2 block">
              {lang === "fa" ? "سرفصل‌های تحلیل:" : "Framework Sections:"}
            </span>
            <div className="space-y-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  } ${isRtl ? 'text-right' : 'text-left'}`}
                >
                  <span>{sec.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Details Area */}
        <div className="md:col-span-8 space-y-6">
          {/* SECTION 1: Summary & Paradigm Shift */}
          {activeSection === "summary" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                <Compass className="w-5 h-5" />
                <span>{lang === "fa" ? "۱. تغییر پارادایم: مرگ جستجوی تک‌کلمه‌ای" : "1. The Paradigm Shift: Beyond Single-Keyword SEO"}</span>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed space-y-4">
                <p>
                  {lang === "fa" ? (
                    <>
                      در سئوی سنتی، ماه‌ها صرف پیدا کردن یک کلمه کلیدی پرحجم (Search Volume) و رتبه گرفتن برای آن در صفحه اول گوگل می‌شد. اما با ورود <strong>ChatGPT Search، Perplexity و Google AI Overviews</strong>، رفتار کاربران بنیادین تغییر کرده است: <strong>جستجو دیگر یک رویداد منفرد نیست، بلکه یک گفتگوی چندمرحله‌ای (Multi-Turn Conversation) است.</strong>
                    </>
                  ) : (
                    <>
                      Traditional SEO spent decades optimizing for isolated high-volume keywords. With the emergence of <strong>ChatGPT Search, Perplexity, and Google AI Overviews</strong>, user behavior has shifted: <strong>search is no longer an isolated query; it is a continuous, evolving conversation.</strong>
                    </>
                  )}
                </p>

                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-2">
                  <span className="font-bold block text-indigo-700 text-sm">
                    {lang === "fa" ? "💡 پیام اصلی مقاله لوئیزا فرام:" : "💡 Core Thesis of the Article:"}
                  </span>
                  <p className="leading-relaxed">
                    {lang === "fa"
                      ? "«کاربران به ندرت با یک سوال کاملاً شکل‌گرفته شروع می‌کنند. آنها در طول گفتگو یاد می‌گیرند، در دیدگاه خود تجدیدنظر می‌کنند و شروط جدید اضافه می‌نمایند. موتورهای جستجو حافظه روابط میان کوئری‌ها را حفظ می‌کنند. برنده برندی است که در پرسش‌های بعدی (Follow-Up Queries) نیز به عنوان پاسخ برگزیده پیشنهاد شود.»"
                      : "Users rarely start with a perfectly formed question. They learn, reconsider, and add context as they proceed. The AI interface remembers the relationship between queries. Brands must optimize to become the AI-recommended answer throughout the entire conversational arc."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: What is Query Fan-Out? */}
          {activeSection === "fanout" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                <Network className="w-5 h-5" />
                <span>{lang === "fa" ? "۲. مفهوم گسترش کوئری (Query Fan-Out) چیست؟" : "2. What is Query Fan-Out?"}</span>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed space-y-4">
                <p>
                  {lang === "fa"
                    ? "یکی از جذاب‌ترین مفاهیم مطرح در مقاله، تکنیک «Query Fan-Out» است. هنگامی که کاربر یک پرسش یا پرامپت می‌نویسد، موتور هوش مصنوعی (مثل گوگل در AI Mode) آن را مستقیماً در دیتابیس جستجو نمی‌کند؛ بلکه آن را به ۳ تا ۶ جستجوی فرعی همزمان در ابعاد مختلف تقسیم می‌کند:"
                    : "One of the most crucial mechanics highlighted is 'Query Fan-Out'. When a user types a prompt, an AI search engine does not simply match strings. It automatically decomposes that prompt into 3 to 6 parallel background sub-queries across multiple dimensions:"}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
                  <div className="text-indigo-600 font-bold">
                    User Query: "Best CRM for real estate agents"
                  </div>
                  <div className="text-slate-600 pl-4 space-y-1">
                    <div>↳ Sub-query 1: real estate CRM pricing tiers 2026</div>
                    <div>↳ Sub-query 2: CRM mobile app ease of use for field agents</div>
                    <div>↳ Sub-query 3: real estate MLS integration support comparison</div>
                    <div>↳ Sub-query 4: real estate agent CRM reddit reviews and complaints</div>
                  </div>
                </div>

                <p>
                  {lang === "fa"
                    ? "اگر وبسایت شما فقط به تعریف کلی CRM بپردازد و به این سوالات فرعی (قیمت، اتصال به MLS، اپ موبایل، نظرات ردیت) پاسخ ندهد، در پاسخ خروجی AI استناد نخواهد شد!"
                    : "If a webpage only covers basic CRM definitions and fails to address these underlying fan-out vectors, it will be skipped by the AI synthesis engine."}
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: 5-Stage Taxonomy */}
          {activeSection === "taxonomy" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                <Layers className="w-5 h-5" />
                <span>{lang === "fa" ? "۳. دسته‌بندی ۵ گانه کوئری‌های تعقیبی و تطابق فرمت" : "3. The 5-Stage Follow-Up Taxonomy & Format Matching"}</span>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <p className="text-sm">
                  {lang === "fa"
                    ? "لوئیزا فرام پیشنهاد می‌کند محتوای خود را طوری ساختاربندی کنید که در طول مسیر گفتگو به ۵ نیاز مشخص پاسخ دهد و فرمت آن دقیقاً با نیاز مطابقت داشته باشد:"
                    : "Louisa Frahm outlines 5 distinct conversational stages and mandates matching each intent to its mathematically optimal format:"}
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-indigo-700 block text-xs mb-1">
                      {lang === "fa" ? "۱. فاز شفاف‌سازی (Clarification)" : "1. Clarification"}
                    </strong>
                    <p className="text-slate-600">
                      {lang === "fa" ? "سوالات: این چیست؟ چطور کار می‌کند؟" : "Queries: What is this? How does it work?"}
                      <br />
                      <strong className="text-slate-800">{lang === "fa" ? "فرمت مطلوب:" : "Ideal Format:"}</strong> {lang === "fa" ? "پاراگراف‌های کوتاه تعریفی و بدون حاشیه (Prose)" : "Crisp 2-sentence direct answer definition."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-sky-700 block text-xs mb-1">
                      {lang === "fa" ? "۲. فاز قیدها و شروط (Constraints)" : "2. Constraints"}
                    </strong>
                    <p className="text-slate-600">
                      {lang === "fa" ? "سوالات: زیر ۵۰۰ دلار، برای تیم‌های ۲ نفره، سازگار با مک" : "Queries: Under $500, for 2-person teams, macOS compatible"}
                      <br />
                      <strong className="text-slate-800">{lang === "fa" ? "فرمت مطلوب:" : "Ideal Format:"}</strong> {lang === "fa" ? "چک‌لیست شرایط، جدول قیمت، بالت‌پوینت‌های محدودیت" : "Condition checklists, pricing breakdown, bullet specs."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-purple-700 block text-xs mb-1">
                      {lang === "fa" ? "۳. فاز مقایسه (Comparison)" : "3. Comparison"}
                    </strong>
                    <p className="text-slate-600">
                      {lang === "fa" ? "سوالات: تفاوت X با Y؟ ۵ جایگزین برتر؟" : "Queries: X vs Y? Top 5 alternatives?"}
                      <br />
                      <strong className="text-slate-800">{lang === "fa" ? "فرمت مطلوب:" : "Ideal Format:"}</strong> {lang === "fa" ? "جدول ماتریس مقایسه ویژگی‌ها (Feature Matrix Table)" : "Feature matrix comparison tables."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-emerald-700 block text-xs mb-1">
                      {lang === "fa" ? "۴. فاز اعتبارسنجی (Validation)" : "4. Validation & Proof"}
                    </strong>
                    <p className="text-slate-600">
                      {lang === "fa" ? "سوالات: نظرات ردیت؟ آیا واقعاً ارزشش را دارد؟ ریسک‌ها چیست؟" : "Queries: Reddit opinions? Is it worth it? Failure rates?"}
                      <br />
                      <strong className="text-slate-800">{lang === "fa" ? "فرمت مطلوب:" : "Ideal Format:"}</strong> {lang === "fa" ? "نقل‌قول‌های معتبر، آمار بنچ‌مارک، گواهی‌های امنیتی" : "Verifiable user quotes, benchmark statistics, security badges."}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-rose-700 block text-xs mb-1">
                      {lang === "fa" ? "۵. فاز اقدام و خرید (Action)" : "5. Action & Decision"}
                    </strong>
                    <p className="text-slate-600">
                      {lang === "fa" ? "سوالات: مراحل نصب؟ راه‌اندازی سریع؟ پلن‌های خرید؟" : "Queries: Setup steps? Quick onboarding? Migration timeline?"}
                      <br />
                      <strong className="text-slate-800">{lang === "fa" ? "فرمت مطلوب:" : "Ideal Format:"}</strong> {lang === "fa" ? "راهنمای گام‌به‌گام شماره‌دار ۱ تا ۵ و ماشین‌حساب ROI" : "Numbered 1-2-3 step workflows and onboarding checklists."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Conversational Scorecard */}
          {activeSection === "scorecard" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                <Award className="w-5 h-5" />
                <span>{lang === "fa" ? "۴. امتیازسنج جستجوی محاوره‌ای (Conversational Scorecard)" : "4. The Conversational Search Scorecard"}</span>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                <p>
                  {lang === "fa"
                    ? "لوئیزا فرام یک سیستم امتیازدهی چندمعیاره معرفی می‌کند که تیم‌ها به جای شمارش تعداد کلمات، آمادگی محتوای خود را برای هوش مصنوعی بسنجند:"
                    : "Frahm introduces a multi-metric scorecard allowing teams to move beyond mere word counts to audit AI citation readiness:"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="text-indigo-700 block mb-1">
                      {lang === "fa" ? "پوشش Fan-Out:" : "Fan-Out Coverage:"}
                    </strong>
                    <span className="text-slate-600">
                      {lang === "fa" ? "آیا به سوالات جانبی و گره‌های تعقیبی پاسخ داده شده است؟" : "Anticipating secondary and tertiary subtopics."}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="text-sky-700 block mb-1">
                      {lang === "fa" ? "قابلیت استخراج (Quotability):" : "Extractive Quotability:"}
                    </strong>
                    <span className="text-slate-600">
                      {lang === "fa" ? "وجود جملات صریح ۲۰ تا ۳۰ کلمه‌ای برای نقل‌قول در پاسخ‌های LLM." : "Tightly phrased answers ready for LLM snippet extraction."}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="text-purple-700 block mb-1">
                      {lang === "fa" ? "تنوع ساختار محتوا:" : "Format Diversity:"}
                    </strong>
                    <span className="text-slate-600">
                      {lang === "fa" ? "استفاده از جداول، لیست‌های بالت و بلوک‌های داده به جای متن یکنواخت." : "Tables, bulleted specs, and callouts over walls of prose."}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <strong className="text-emerald-700 block mb-1">
                      {lang === "fa" ? "پاسخ به تردیدها (Objections):" : "Objection Handling:"}
                    </strong>
                    <span className="text-slate-600">
                      {lang === "fa" ? "پوشش معایب، هزینه‌های پنهان و مواردی که این راه‌حل مناسب نیست." : "Honest drawbacks, hidden costs, and failure modes."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Tools Landscape */}
          {activeSection === "tools" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold">
                <Wrench className="w-5 h-5" />
                <span>{lang === "fa" ? "۵. بررسی ابزارهای فعال بازار در حوزه Fan-Out و سئوی محاوره‌ای" : "5. The Emerging Tool Landscape"}</span>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                <p>
                  {lang === "fa"
                    ? "در حال حاضر موج جدیدی از ابزارهای هوش مصنوعی و سئو (Generative Engine Optimization - GEO) برای تحلیل و ره‌گیری Query Fan-Out شکل گرفته است:"
                    : "A new cohort of GEO and Conversational Search tools has emerged around query fan-out mapping and citation tracking:"}
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Locomotive & SEO Review Tools</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono">Query Fan-Out Analyzers</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      {lang === "fa"
                        ? "تحلیل چگونگی گسترش یک پرسش توسط موتورهای جستجوی هوش مصنوعی به سوالات و موضوعات مرتبط برای یافتن شکاف‌های محتوا."
                        : "Analyzes how AI search engines expand a prompt into subtopics to pinpoint content gaps."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Profound & LLMrefs</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono">Enterprise AEO / GEO</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      {lang === "fa"
                        ? "سرویس‌های سازمانی برای سنجش سهم صدای برند (Share of Voice) در پاسخ‌های ChatGPT و Perplexity و ردگیری ارجاعات فرعی."
                        : "Tracks brand citations, share of voice, and multi-turn mentions across ChatGPT, Perplexity, and Gemini."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Radarkit, Otterly & Wellows</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono">Prompt & Sub-Query Monitors</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      {lang === "fa"
                        ? "ردگیری رفتار پرامپت‌ها در پلتفرم‌های هوش مصنوعی و اتصال الگوی Fan-Out به استنادها و نام‌بری از برند."
                        : "Connects prompt fan-out behavior directly with AI citation frequency and competitive visibility."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Rankability & SE Ranking</strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono">Query Branching & Briefs</span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      {lang === "fa"
                        ? "ترسیم شاخه‌های کوئری، تحلیل پاسخ‌های SERP هوش مصنوعی و ساخت بریف‌های تولید محتوا بر مبنای سفر کاربر."
                        : "Generates content briefs aligned with query branch mapping and conversational intent."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
