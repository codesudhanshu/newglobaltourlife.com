import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import PageSeo, { type IPageSeo } from "@/lib/models/PageSeo";
import { getSeoPage } from "@/lib/seoPages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.newglobaltourlife.com";

export type PageSeoData = {
  pageKey: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  h1: string;
  longContent: string;
  faqs: { question: string; answer: string }[];
};

// Server-side: read a page's SEO record straight from the DB (used in generateMetadata
// and in server components). Falls back to the registry defaults when unset.
export async function getPageSeo(key: string): Promise<PageSeoData> {
  const def = getSeoPage(key);
  let doc: IPageSeo | null = null;
  try {
    await connectDB();
    doc = await PageSeo.findOne({ pageKey: key }).lean<IPageSeo>();
  } catch {
    doc = null;
  }
  return {
    pageKey: key,
    title: doc?.title || def?.defaultTitle || "",
    description: doc?.description || def?.defaultDescription || "",
    keywords: doc?.keywords || "",
    canonical: doc?.canonical || (def ? def.path : ""),
    robots: doc?.robots || "index,follow",
    ogTitle: doc?.ogTitle || doc?.title || def?.defaultTitle || "",
    ogDescription: doc?.ogDescription || doc?.description || def?.defaultDescription || "",
    ogImage: doc?.ogImage || "",
    twitterCard: doc?.twitterCard || "summary_large_image",
    h1: doc?.h1 || "",
    longContent: doc?.longContent || "",
    faqs: (doc?.faqs || []).map((f) => ({ question: f.question, answer: f.answer })),
  };
}

function toAbsolute(url: string): string {
  if (!url) return SITE_URL;
  if (url.startsWith("http")) return url;
  return SITE_URL.replace(/\/$/, "") + (url.startsWith("/") ? url : "/" + url);
}

// Build a Next.js Metadata object from a page's SEO data.
export function buildMetadata(seo: PageSeoData): Metadata {
  const canonical = toAbsolute(seo.canonical);
  const images = seo.ogImage ? [{ url: toAbsolute(seo.ogImage) }] : undefined;
  return {
    title: seo.title || undefined,
    description: seo.description || undefined,
    keywords: seo.keywords || undefined,
    alternates: { canonical },
    robots: seo.robots || undefined,
    openGraph: {
      title: seo.ogTitle || seo.title || undefined,
      description: seo.ogDescription || seo.description || undefined,
      url: canonical,
      images,
      type: "website",
      siteName: "New Global Tour Life",
    },
    twitter: {
      card: (seo.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title: seo.ogTitle || seo.title || undefined,
      description: seo.ogDescription || seo.description || undefined,
      images: images?.map((i) => i.url),
    },
  };
}

// JSON-LD FAQ schema string for a page's FAQs (empty if none).
export function faqJsonLd(faqs: { question: string; answer: string }[]): string | null {
  const valid = faqs.filter((f) => f.question.trim() && f.answer.trim());
  if (valid.length === 0) return null;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}
