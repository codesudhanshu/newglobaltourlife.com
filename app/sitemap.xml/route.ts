import { connectDB } from "@/lib/db";
import { SITE_URL, getSiteConfig } from "@/lib/siteConfig";
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
import Flight from "@/lib/models/Flight";
import Category from "@/lib/models/Category";
import { toSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

const base = SITE_URL.replace(/\/$/, "");

type Row = {
  slug?: string;
  _id: unknown;
  updatedAt?: Date;
  name?: string;
  title?: string;
  image?: string;
  images?: string[];
  imageAlts?: string[];
};

type Entry = {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
  images: { url: string; title?: string }[];
};

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Only real, absolute image URLs belong in a sitemap — this is what makes Google
// index the uploaded Cloudinary images instead of guessing from the page.
function imageUrls(r: Row): { url: string; title?: string }[] {
  const raw = [r.image, ...(r.images || [])].filter((u): u is string => !!u && /^https?:\/\//.test(u));
  const label = r.name || r.title || "";
  return Array.from(new Set(raw))
    .slice(0, 20) // Google caps at 1,000 images per page; 20 is plenty here
    .map((url, i) => ({ url, title: r.imageAlts?.[i] || label || undefined }));
}

async function collect(
  model: { find: (f: object) => { select: (s: string) => { lean: () => Promise<Row[]> } } },
  filter: object
): Promise<Entry[]> {
  try {
    const rows = await model.find(filter).select("slug updatedAt name title image images imageAlts").lean();
    return rows
      .filter((r) => r.slug || r._id)
      .map((r) => ({
        loc: `${base}/${r.slug || String(r._id)}`,
        lastmod: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
        changefreq: "weekly",
        priority: "0.7",
        images: imageUrls(r),
      }));
  } catch {
    return [];
  }
}

// Distinct city slugs that have at least one bookable hotel.
async function citySlugs(): Promise<string[]> {
  try {
    const rows = await Hotel.find({ available: true }).select("city").lean<{ city?: string }[]>();
    return Array.from(new Set(rows.map((r) => toSlug(r.city || "")).filter(Boolean)));
  } catch {
    return [];
  }
}

// Car category slugs (from the Category collection, plus free-text categories).
async function categorySlugs(): Promise<string[]> {
  try {
    const [cats, cars] = await Promise.all([
      Category.find({}).select("slug").lean<{ slug?: string }[]>(),
      Car.find({ available: true }).select("category").lean<{ category?: string }[]>(),
    ]);
    return Array.from(
      new Set([
        ...cats.map((c) => (c.slug || "").trim()).filter(Boolean),
        ...cars.map((c) => toSlug(c.category || "")).filter(Boolean),
      ])
    );
  } catch {
    return [];
  }
}

function buildXml(entries: Entry[]): string {
  const urls = entries
    .map((e) => {
      const imgs = e.images
        .map(
          (im) =>
            `    <image:image>\n      <image:loc>${xmlEscape(im.url)}</image:loc>` +
            (im.title ? `\n      <image:title>${xmlEscape(im.title)}</image:title>` : "") +
            `\n    </image:image>`
        )
        .join("\n");
      return (
        `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n` +
        (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "") +
        `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n` +
        (imgs ? imgs + "\n" : "") +
        `  </url>`
      );
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

// Served at /sitemap.xml. Admin can upload their own XML (Sitemap page →
// "Uploaded XML"), otherwise it is generated from the database and includes
// <image:image> entries so uploaded photos get indexed.
export async function GET() {
  const cfg = await getSiteConfig();

  if (cfg.sitemapMode === "custom" && cfg.customSitemapXml.trim()) {
    return new Response(cfg.customSitemapXml.trim(), {
      headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
    });
  }

  try {
    await connectDB();
  } catch {
    // DB down — still serve the static pages
  }

  const staticPages: Entry[] = SEO_PAGES.map((p) => ({
    loc: `${base}${p.path === "/" ? "" : p.path}`,
    changefreq: "weekly",
    priority: p.path === "/" ? "1.0" : "0.8",
    images: [],
  }));

  // Clean filter pages: /destinations/<region>, /hotels/<city>, /cars/<category>
  const filterPages: Entry[] = [
    { loc: `${base}/destinations/india`, changefreq: "weekly", priority: "0.8", images: [] },
    { loc: `${base}/destinations/world`, changefreq: "weekly", priority: "0.8", images: [] },
    ...(await citySlugs()).map((c) => ({
      loc: `${base}/hotels/${c}`,
      changefreq: "weekly",
      priority: "0.7",
      images: [],
    })),
    ...(await categorySlugs()).map((c) => ({
      loc: `${base}/cars/${c}`,
      changefreq: "weekly",
      priority: "0.7",
      images: [],
    })),
  ];

  const groups = await Promise.all([
    collect(Car as never, { available: true }),
    collect(Hotel as never, { available: true }),
    collect(Package as never, { available: true }),
    collect(Destination as never, { active: true }),
    collect(TirthYatra as never, {}),
    collect(Bus as never, { available: true }),
    collect(Visa as never, { available: true }),
    collect(TourGuide as never, { available: true }),
    collect(Blog as never, { published: true }),
    collect(Flight as never, { available: true }),
  ]);

  return new Response(buildXml([...staticPages, ...filterPages, ...groups.flat()]), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" },
  });
}
