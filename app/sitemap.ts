import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { SITE_URL } from "@/lib/siteConfig";
import { SEO_PAGES } from "@/lib/seoPages";
import Car from "@/lib/models/Car";
import Hotel from "@/lib/models/Hotel";
import Package from "@/lib/models/Package";
import Destination from "@/lib/models/Destination";
import TirthYatra from "@/lib/models/TirthYatra";
import Bus from "@/lib/models/Bus";
import Visa from "@/lib/models/Visa";
import TourGuide from "@/lib/models/TourGuide";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

const base = SITE_URL.replace(/\/$/, "");

type Row = { slug?: string; _id: unknown; updatedAt?: Date };

async function collect(
  model: { find: (f: object) => { select: (s: string) => { lean: () => Promise<Row[]> } } },
  filter: object
): Promise<MetadataRoute.Sitemap> {
  try {
    const rows = await model.find(filter).select("slug updatedAt").lean();
    return rows.map((r) => ({
      url: `${base}/${r.slug || String(r._id)}`,
      lastModified: r.updatedAt || undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();
  } catch {
    // DB down — still return static pages
  }

  // Static / landing pages from the SEO registry
  const staticPages: MetadataRoute.Sitemap = SEO_PAGES.map((p) => ({
    url: `${base}${p.path === "/" ? "" : p.path}`,
    changeFrequency: "weekly",
    priority: p.path === "/" ? 1 : 0.8,
  }));

  const dynamicGroups = await Promise.all([
    collect(Car as never, { available: true }),
    collect(Hotel as never, { available: true }),
    collect(Package as never, { available: true }),
    collect(Destination as never, { active: true }),
    collect(TirthYatra as never, {}),
    collect(Bus as never, { available: true }),
    collect(Visa as never, { available: true }),
    collect(TourGuide as never, { available: true }),
    collect(Blog as never, { published: true }),
  ]);

  return [...staticPages, ...dynamicGroups.flat()];
}
