export interface SampleTopic {
  id: string;
  titleEn: string;
  titleFa: string;
  brandEn?: string;
  brandFa?: string;
  category: string;
}

export const sampleTopics: SampleTopic[] = [
  {
    id: "crm",
    titleEn: "Best B2B CRM for small remote teams",
    titleFa: "بهترین نرم‌افزار CRM برای تیم‌های استارتاپی کوچک",
    brandEn: "HubSpot vs Attio",
    brandFa: "دیدار یا هاب‌اسپات",
    category: "SaaS & Software"
  },
  {
    id: "shoes",
    titleEn: "Running shoes for marathon training with flat feet",
    titleFa: "بهترین کتانی رانینگ برای ماراتن و کف پای صاف",
    brandEn: "Brooks / Asics",
    brandFa: "آسیکس و هوکا",
    category: "E-Commerce"
  },
  {
    id: "cloud-db",
    titleEn: "Cloud database vs self-hosted PostgreSQL for fintech",
    titleFa: "پایگاه داده ابری در برابر پستگرس برای فین‌تک",
    brandEn: "Supabase vs AWS RDS",
    brandFa: "سرویس‌های ابری",
    category: "Engineering"
  },
  {
    id: "seo-ai",
    titleEn: "How to optimize content for Google AI Overviews and ChatGPT Search",
    titleFa: "چگونه محتوا را برای جستجوی هوش مصنوعی و AI Overviews بهینه‌سازی کنیم",
    brandEn: "Generative Engine Optimization (GEO)",
    brandFa: "سئوی محاوره‌ای و GEO",
    category: "Digital Marketing"
  }
];

export const sampleDraftAuditContent = `
# How to Choose the Best B2B CRM for Growing Teams

Selecting a customer relationship management (CRM) platform is one of the most critical decisions for a modern sales and support team. In this guide, we explore why a CRM is useful and what options exist.

A CRM helps companies organize contacts, log communication history, and forecast revenue. Without a CRM, sales representatives often lose track of leads in spreadsheets, causing revenue leakage.

### Key Considerations
When evaluating systems, you should consider contact limits, ease of use, and API integrations with tools like Slack, Google Workspace, and Stripe.

Most platforms offer tiered subscriptions with monthly per-user billing. Make sure to check customer support availability before making a final commitment.
`;
