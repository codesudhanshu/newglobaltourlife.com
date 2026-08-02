import { permanentRedirect } from "next/navigation";
import Footer from "@/components/Footer";
import SeoContent from "@/components/SeoContent";
import { getPageSeo, buildMetadata } from "@/lib/seo";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";
import Category from "@/lib/models/Category";
import { toSlug, fromSlug } from "@/lib/slug";
import CarsClient from "../CarsClient";

export const revalidate = 300;

// Rendered on first request, then cached and revalidated — no static build step
// needed, but repeat visits are served from the cache instead of hitting MongoDB.
export async function generateStaticParams() {
  return [];
}

// Clean category URL: /cars/tempo-traveller instead of /cars?category=tempo-traveller.
// Legacy /cars/<car-slug> links redirect to the flat detail URL.
async function resolveCategory(
  segment: string
): Promise<{ slug: string; name: string } | { redirectTo: string }> {
  try {
    await connectDB();
    const cat = await Category.findOne({ slug: segment }).select("slug name").lean<{ slug?: string; name?: string }>();
    if (cat?.slug) return { slug: cat.slug, name: cat.name || fromSlug(segment) };

    const car = await Car.findOne({ slug: segment }).select("slug").lean<{ slug?: string }>();
    if (car?.slug) return { redirectTo: `/${car.slug}` };

    // Categories are also stored as free text on the car itself.
    const cars = await Car.find({ available: true }).select("category").lean<{ category?: string }[]>();
    const match = cars.map((c) => c.category || "").find((c) => c && toSlug(c) === segment);
    if (match) return { slug: segment, name: match };
  } catch {
    // DB unavailable — fall back to the de-slugified label
  }
  return { slug: segment, name: fromSlug(segment) };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: segment } = await params;
  const resolved = await resolveCategory(segment);
  if ("redirectTo" in resolved) return {};
  const seo = await getPageSeo("cars");
  return buildMetadata({
    ...seo,
    title: `${resolved.name} on Rent — Book Cabs & Cars | New Global Tour Life`,
    description: `Book ${resolved.name} for local, outstation and airport transfers. Clean vehicles, experienced drivers and transparent fares.`,
    canonical: `/cars/${segment}`,
    longContent: "",
    faqs: [],
  });
}

export default async function CarsByCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: segment } = await params;
  const resolved = await resolveCategory(segment);
  if ("redirectTo" in resolved) permanentRedirect(resolved.redirectTo);

  const seo = await getPageSeo("cars");
  return (
    <>
      <CarsClient initialCategory={resolved.slug} />
      <SeoContent seo={seo} />
      <Footer />
    </>
  );
}
