import { permanentRedirect } from "next/navigation";
import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { toSlug, fromSlug } from "@/lib/slug";
import HotelsClient from "../HotelsClient";

export const revalidate = 300;

// Rendered on first request, then cached and revalidated — no static build step
// needed, but repeat visits are served from the cache instead of hitting MongoDB.
export async function generateStaticParams() {
  return [];
}

// Clean city URL: /hotels/indore instead of /hotels?city=Indore.
// Legacy /hotels/<hotel-slug> links still work — they redirect to the flat
// detail URL rather than 404ing.
async function resolveCity(segment: string): Promise<{ city: string } | { redirectTo: string }> {
  try {
    await connectDB();
    const hotelBySlug = await Hotel.findOne({ slug: segment }).select("slug").lean<{ slug?: string }>();
    if (hotelBySlug?.slug) return { redirectTo: `/${hotelBySlug.slug}` };

    // Match the slug back to a real city name so the heading reads correctly.
    const cities = await Hotel.find({ available: true }).select("city").lean<{ city?: string }[]>();
    const match = cities.map((h) => h.city || "").find((c) => c && toSlug(c) === segment);
    if (match) return { city: match };
  } catch {
    // DB unavailable — fall back to the de-slugified label
  }
  return { city: fromSlug(segment) };
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city: segment } = await params;
  const resolved = await resolveCity(segment);
  if ("redirectTo" in resolved) return {};
  const seo = await getPageSeo("hotels");
  const city = resolved.city;
  return buildMetadata({
    ...seo,
    title: `Hotels in ${city} — Book at Best Rates | New Global Tour Life`,
    description: `Compare and book hotels in ${city}. Budget to luxury stays with instant enquiry and the best available rates.`,
    canonical: `/hotels/${segment}`,
    // City pages get their own H1/heading, not the parent page's content body.
    longContent: "",
    faqs: [],
  });
}

export default async function HotelsByCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: segment } = await params;
  const resolved = await resolveCity(segment);
  if ("redirectTo" in resolved) permanentRedirect(resolved.redirectTo);

  const seo = await getPageSeo("hotels");
  return (
    <>
      <HotelsClient initialCity={resolved.city} />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
