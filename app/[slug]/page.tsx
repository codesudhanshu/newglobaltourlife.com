import { notFound } from "next/navigation";
import { resolveSlug } from "@/lib/resolveSlug";
import { itemMetadata } from "@/lib/seo";
import CarDetailClient from "@/components/detail/CarDetailClient";
import HotelDetailClient from "@/components/detail/HotelDetailClient";
import PackageDetailClient from "@/components/detail/PackageDetailClient";
import DestinationDetailClient from "@/components/detail/DestinationDetailClient";
import TirthYatraDetailClient from "@/components/detail/TirthYatraDetailClient";
import BusDetailClient from "@/components/detail/BusDetailClient";
import VisaDetailClient from "@/components/detail/VisaDetailClient";
import TourGuideDetailClient from "@/components/detail/TourGuideDetailClient";
import BlogDetailClient from "@/components/detail/BlogDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolveSlug(slug);
  if (!r) return {};
  const d = r.doc as Record<string, string>;
  const title = d.name || d.title || "Detail";
  return itemMetadata(d, {
    fallbackTitle: `${title} — New Global Tour Life`,
    fallbackDescription: d.description || "",
    fallbackImage: d.image || "",
    path: `/${slug}`,
  });
}

export default async function FlatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolveSlug(slug);
  if (!r) notFound();

  const d = r.doc as Record<string, string>;
  const schema = d.schemaJsonLd ? (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: d.schemaJsonLd }} />
  ) : null;

  switch (r.type) {
    case "car":         return (<>{schema}<CarDetailClient idOrSlug={slug} /></>);
    case "hotel":       return (<>{schema}<HotelDetailClient idOrSlug={slug} /></>);
    case "package":     return (<>{schema}<PackageDetailClient idOrSlug={slug} /></>);
    case "destination": return (<>{schema}<DestinationDetailClient idOrSlug={slug} /></>);
    case "tirth":       return (<>{schema}<TirthYatraDetailClient idOrSlug={slug} /></>);
    case "bus":         return (<>{schema}<BusDetailClient idOrSlug={slug} /></>);
    case "visa":        return (<>{schema}<VisaDetailClient idOrSlug={slug} /></>);
    case "guide":       return (<>{schema}<TourGuideDetailClient idOrSlug={slug} /></>);
    case "blog":        return (<>{schema}<BlogDetailClient idOrSlug={slug} /></>);
    default:            notFound();
  }
}
