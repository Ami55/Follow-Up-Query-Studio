export interface AppTranslations {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  tabOverview: string;
  tabFanOut: string;
  tabScorecard: string;
  tabSimulator: string;
  tabGuide: string;
  tabBrief: string;
  searchPlaceholder: string;
  brandPlaceholder: string;
  analyzeBtn: string;
  analyzing: string;
  sampleTopicsTitle: string;
  executiveSummary: string;
  keyEntities: string;
  overviewTriggerScore: string;
  stagesTitle: string;
  clarification: string;
  clarificationDesc: string;
  constraints: string;
  constraintsDesc: string;
  comparison: string;
  comparisonDesc: string;
  validation: string;
  validationDesc: string;
  action: string;
  actionDesc: string;
  fanOutSearches: string;
  recommendedFormat: string;
  citationLikelihood: string;
  contentTip: string;
  difficulty: string;
  exportBrief: string;
  auditTitle: string;
  auditSubtitle: string;
  pasteContentPlaceholder: string;
  topicPlaceholder: string;
  runAuditBtn: string;
  auditing: string;
  overallScore: string;
  metricsBreakdown: string;
  gapsTitle: string;
  readySnippets: string;
  copySnippet: string;
  copied: string;
  simTitle: string;
  simSubtitle: string;
  askAiPlaceholder: string;
  sendQuery: string;
  backgroundFanOut: string;
  citedSources: string;
  suggestedFollowUps: string;
  clearChat: string;
  articleDeepDiveTitle: string;
  readArticleSummary: string;
  marketToolsTitle: string;
}

export const translations: Record<'en' | 'fa', AppTranslations> = {
  en: {
    appTitle: "Follow-Up Query Studio",
    appSubtitle: "Conversational Search & Follow-Up Query Intelligence",
    tagline: "Rethink SEO for AI Overviews, ChatGPT Search & Perplexity based on Louisa Frahm's framework.",
    tabOverview: "Home & Overview",
    tabFanOut: "Query Fan-Out & Journey",
    tabScorecard: "Conversational Scorecard",
    tabSimulator: "AI Search Simulator",
    tabBrief: "Content Brief",
    tabGuide: "Article Deep-Dive",
    searchPlaceholder: "Enter seed topic (e.g., Best B2B CRM, Running Shoes for Flat Feet, AI Code Assistant)...",
    brandPlaceholder: "Optional brand name or URL (e.g., Acme Corp)...",
    analyzeBtn: "Map Conversational Journey",
    analyzing: "Deconstructing Query Fan-Out & Multi-Turn Journey...",
    sampleTopicsTitle: "Quick Exploration Presets:",
    executiveSummary: "Executive Conversational Journey Summary",
    keyEntities: "Extracted Topic Entities",
    overviewTriggerScore: "AI Overview Fan-Out Propensity",
    stagesTitle: "The 5-Stage Follow-Up Taxonomy",
    clarification: "1. Clarification",
    clarificationDesc: "Core concepts, definitions, and foundational understanding",
    constraints: "2. Constraints",
    constraintsDesc: "Limits, budgets, team sizes, technical dependencies, and constraints",
    comparison: "3. Comparison",
    comparisonDesc: "Alternatives, 'X vs Y', market positioning, and trade-offs",
    validation: "4. Validation & Proof",
    validationDesc: "Real-world reviews, Reddit consensus, benchmarks, and risk checks",
    action: "5. Action & Decision",
    actionDesc: "Implementation steps, onboarding, pricing tiers, and ROI calculators",
    fanOutSearches: "Background Fan-Out Sub-Queries (Executed by AI Engine):",
    recommendedFormat: "Recommended Format:",
    citationLikelihood: "AI Citation Likelihood:",
    contentTip: "Optimization Tip for AI Citation:",
    difficulty: "Difficulty:",
    exportBrief: "Export Content Blueprint",
    auditTitle: "Conversational Readiness Scorecard",
    auditSubtitle: "Audit your content against the 5 criteria needed to become the AI-recommended answer.",
    pasteContentPlaceholder: "Paste your draft content, blog post, product page copy, or outline here...",
    topicPlaceholder: "Target query or topic (e.g., Headless CMS for Next.js)...",
    runAuditBtn: "Run Conversational Audit",
    auditing: "Auditing content against Conversational Search Scorecard...",
    overallScore: "Conversational GEO Score",
    metricsBreakdown: "Core Scorecard Metrics",
    gapsTitle: "Identified Conversational Gaps",
    readySnippets: "AI Citation Injectable Snippets",
    copySnippet: "Copy Snippet",
    copied: "Copied!",
    simTitle: "Multi-Turn AI Search Engine Simulator",
    simSubtitle: "Experience how AI search engines fan out sub-queries in real-time across turns.",
    askAiPlaceholder: "Ask a question or select a suggested follow-up...",
    sendQuery: "Ask AI Engine",
    backgroundFanOut: "Query Fan-Out Searches Executed Behind the Scenes:",
    citedSources: "Sources Cited by AI Engine:",
    suggestedFollowUps: "Anticipated Follow-Up Queries:",
    clearChat: "Reset Conversation",
    articleDeepDiveTitle: "Search Engine Land Article Analysis",
    readArticleSummary: "Key insights, mechanisms, and tools from Louisa Frahm's published framework.",
    marketToolsTitle: "Current Market Landscape: Conversational & Query Fan-Out Tools"
  },
  fa: {
    appTitle: "استودیو سئو FanOut",
    appSubtitle: "هوشمندی جستجوی محاوره‌ای و کوئری‌های تعقیبی (Follow-Up)",
    tagline: "بازنگری سئو برای AI Overviews، ChatGPT Search و Perplexity بر اساس مقاله لوئیزا فرام در Search Engine Land.",
    tabOverview: "خانه و راهنمای شروع",
    tabFanOut: "نقشه سفر کوئری و Fan-Out",
    tabScorecard: "امتیازسنج سئو محاوره‌ای",
    tabSimulator: "شبیه‌ساز موتور هوش مصنوعی",
    tabBrief: "طرح تولید محتوا (Brief)",
    tabGuide: "تحلیل تخصصی مقاله",
    searchPlaceholder: "موضوع یا کلمه کلیدی اولیه را وارد کنید (مثال: بهترین CRM سازمانی، دیتابیس ابری، کتانی ورزشی)...",
    brandPlaceholder: "نام برند یا دامنه اختیاری (مثال: دیجی‌کالا، اسنپ، زیمنس)...",
    analyzeBtn: "ترسیم نقشه سفر محاوره‌ای",
    analyzing: "تحلیل شاخه‌های Query Fan-Out و سفر چندمرحله‌ای...",
    sampleTopicsTitle: "موضوعات پیشنهادی برای تست سریع:",
    executiveSummary: "خلاصه مدیریتی سفر محاوره‌ای مخاطب",
    keyEntities: "موجودیت‌های کلیدی استخراج‌شده",
    overviewTriggerScore: "احتمال فعال‌سازی AI Overview و Fan-Out",
    stagesTitle: "طبقه‌بندی ۵ گانه کوئری‌های تعقیبی (Taxonomy)",
    clarification: "۱. شفاف‌سازی (Clarification)",
    clarificationDesc: "درک مفاهیم بنیادی، تعاریف و «این موضوع دقیقاً چیست؟»",
    constraints: "۲. قیدها و محدودیت‌ها (Constraints)",
    constraintsDesc: "بودجه، محدودیت تیم، سیستم‌عامل، مقیاس و محدودیت‌های زمانی",
    comparison: "۳. مقایسه و گزینه‌ها (Comparison)",
    comparisonDesc: "جایگزین‌ها، رقبا، بررسی «X در برابر Y» و موازنه‌ها",
    validation: "۴. اعتبارسنجی و اثبات (Validation)",
    validationDesc: "نظرات واقعی ردیت، تجربیات کاربران، بنچ‌مارک‌ها و ریسک‌ها",
    action: "۵. اقدام و تصمیم نهایی (Action)",
    actionDesc: "مراحل راه‌اندازی، قیمت‌گذاری، آنبوردینگ و محاسبه بازگشت سرمایه",
    fanOutSearches: "کوئری‌های فرعی که هوش مصنوعی در پس‌زمینه اجرا می‌کند (Query Fan-Out):",
    recommendedFormat: "فرمت محتوایی پیشنهادی:",
    citationLikelihood: "احتمال ارجاع و استناد توسط AI:",
    contentTip: "نکته بهینه‌سازی برای نقل‌قول در پاسخ‌های هوش مصنوعی:",
    difficulty: "درجه سختی رقابت:",
    exportBrief: "خروجی طرح جامع محتوا",
    auditTitle: "ارزیاب آمادگی برای جستجوی محاوره‌ای (Scorecard)",
    auditSubtitle: "محتوای خود را بر اساس معیارهای ۵ گانه لوئیزا فرام برای تبدیل شدن به پاسخ برگزیده AI بسنجید.",
    pasteContentPlaceholder: "متن پیش‌نویس، مقاله، صفحه محصول یا سرفصل‌های خود را اینجا قرار دهید...",
    topicPlaceholder: "موضوع یا عبارت هدف (مثال: راهنمای خرید سیستم حسابداری ابری)...",
    runAuditBtn: "شروع بررسی و ارزیابی محتوا",
    auditing: "در حال ممیزی محتوا بر اساس سنجه‌های Conversational Scorecard...",
    overallScore: "امتیاز کل سئوی نسلی (GEO Score)",
    metricsBreakdown: "تحلیل سنجه‌های کلیدی امتیازسنج",
    gapsTitle: "شکاف‌های محتوایی شناسایی‌شده",
    readySnippets: "بلوک‌های آماده تزریق به متن برای استخراج توسط AI",
    copySnippet: "کپی بلوک",
    copied: "کپی شد!",
    simTitle: "شبیه‌ساز موتور جستجوی هوش مصنوعی",
    simSubtitle: "مشاهده عملکرد واقعی موتورهای هوش مصنوعی و اجرای Fan-Out در پس‌زمینه.",
    askAiPlaceholder: "سوال خود را بنویسید یا یکی از گزینه‌های پیشنهادی را کلیک کنید...",
    sendQuery: "پرسش از موتور هوش مصنوعی",
    backgroundFanOut: "جستجوهای فرعی انجام شده در پس‌زمینه (Fan-Out):",
    citedSources: "منابع استناد شده توسط هوش مصنوعی:",
    suggestedFollowUps: "پرسش‌های تعقیبی احتمالی بعدی:",
    clearChat: "شروع گفتگوی جدید",
    articleDeepDiveTitle: "تحلیل جامع مقاله Search Engine Land",
    readArticleSummary: "بررسی تمام دیدگاه‌ها، مدل فکری لوئیزا فرام و ابزارهای مطرح بازار.",
    marketToolsTitle: "ابزارهای فعال بازار در حوزه Conversational SEO و Fan-Out"
  }
};
