import { notFound, permanentRedirect } from "next/navigation";
import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import Destination from "@/lib/models/Destination";
import DestinationsClient from "../DestinationsClient";

export const revalidate = 300;

// Rendered on first request, then cached and revalidated — no static build step
// needed, but repeat visits are served from the cache instead of hitting MongoDB.
export async function generateStaticParams() {
  return [];
}

const REGIONS: Record<string, "India" | "World"> = { india: "India", world: "World" };

// Clean region URL: /destinations/india instead of /destinations?region=India.
// Any other segment is treated as a legacy /destinations/<slug> detail link.
async function resolveRegion(segment: string): Promise<{ region: "India" | "World" } | { redirectTo: string }> {
  const region = REGIONS[segment.toLowerCase()];
  if (region) return { region };
  try {
    await connectDB();
    const doc = await Destination.findOne({ slug: segment }).select("slug").lean<{ slug?: string }>();
    if (doc?.slug) return { redirectTo: `/${doc.slug}` };
  } catch {
    // fall through to 404
  }
  return { redirectTo: "" };
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region: segment } = await params;
  const resolved = await resolveRegion(segment);
  if (!("region" in resolved)) return {};
  const seo = await getPageSeo("destinations");
  const region = resolved.region;
  return buildMetadata({
    ...seo,
    title:
      region === "India"
        ? "Destinations in India — Tour Packages & Travel Guide | New Global Tour Life"
        : "International Destinations — Tour Packages & Travel Guide | New Global Tour Life",
    description: `Explore trending ${region === "India" ? "Indian" : "international"} destinations with curated tour packages, stays and transport.`,
    canonical: `/destinations/${segment.toLowerCase()}`,
    longContent: "",
    faqs: [],
  });
}

export default async function DestinationsByRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: segment } = await params;
  const resolved = await resolveRegion(segment);
  if (!("region" in resolved)) {
    if (resolved.redirectTo) permanentRedirect(resolved.redirectTo);
    notFound();
  }

  const seo = await getPageSeo("destinations");
  return (
    <>
      <DestinationsClient initialRegion={resolved.region} />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
