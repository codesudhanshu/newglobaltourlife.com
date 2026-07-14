import { connectDB } from "@/lib/db";
import SiteConfig, { type ISiteConfig } from "@/lib/models/SiteConfig";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.newglobaltourlife.com";

export type SiteConfigData = {
  gtmId: string;
  gaId: string;
  gscVerification: string;
  headScripts: string;
  robotsTxt: string;
  orgName: string;
  orgLogo: string;
  orgUrl: string;
  orgPhone: string;
  orgSameAs: string[];
};

const DEFAULTS: SiteConfigData = {
  gtmId: "", gaId: "", gscVerification: "", headScripts: "", robotsTxt: "",
  orgName: "New Global Tour Life", orgLogo: "", orgUrl: SITE_URL,
  orgPhone: "+91-9131727811", orgSameAs: [],
};

export async function getSiteConfig(): Promise<SiteConfigData> {
  try {
    await connectDB();
    const doc = await SiteConfig.findOne().lean<ISiteConfig>();
    if (!doc) return DEFAULTS;
    return {
      gtmId: doc.gtmId || "",
      gaId: doc.gaId || "",
      gscVerification: doc.gscVerification || "",
      headScripts: doc.headScripts || "",
      robotsTxt: doc.robotsTxt || "",
      orgName: doc.orgName || DEFAULTS.orgName,
      orgLogo: doc.orgLogo || "",
      orgUrl: doc.orgUrl || SITE_URL,
      orgPhone: doc.orgPhone || DEFAULTS.orgPhone,
      orgSameAs: Array.isArray(doc.orgSameAs) ? doc.orgSameAs.filter(Boolean) : [],
    };
  } catch {
    return DEFAULTS;
  }
}

export function defaultRobots(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${SITE_URL.replace(/\/$/, "")}/sitemap.xml`;
}

export function organizationJsonLd(cfg: SiteConfigData): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: cfg.orgName,
    url: cfg.orgUrl || SITE_URL,
    logo: cfg.orgLogo || undefined,
    telephone: cfg.orgPhone || undefined,
    sameAs: cfg.orgSameAs.length ? cfg.orgSameAs : undefined,
  });
}
