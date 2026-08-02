import { notFound } from "next/navigation";
import { resolveSlug, serializeDoc, type DetailType } from "@/lib/resolveSlug";
import { itemMetadata, faqJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteConfig";
import JsonLd from "@/components/JsonLd";
import CarDetailClient from "@/components/detail/CarDetailClient";
import HotelDetailClient from "@/components/detail/HotelDetailClient";
import PackageDetailClient from "@/components/detail/PackageDetailClient";
import DestinationDetailClient from "@/components/detail/DestinationDetailClient";
import TirthYatraDetailClient from "@/components/detail/TirthYatraDetailClient";
import BusDetailClient from "@/components/detail/BusDetailClient";
import VisaDetailClient from "@/components/detail/VisaDetailClient";
import TourGuideDetailClient from "@/components/detail/TourGuideDetailClient";
import BlogDetailClient from "@/components/detail/BlogDetailClient";
import FlightDetailClient from "@/components/detail/FlightDetailClient";

// Cached HTML, re-rendered at most once a minute — keeps TTFB low while still
// picking up admin edits quickly.
export const revalidate = 60;

// Rendered on first request, then cached and revalidated — no static build step
// needed, but repeat visits are served from the cache instead of hitting MongoDB.
export async function generateStaticParams() {
  return [];
}

// The listing page each detail type belongs to (used for breadcrumb schema).
const PARENT: Record<DetailType, { label: string; path: string }> = {
  car: { label: "Cars", path: "/cars" },
  hotel: { label: "Hotels", path: "/hotels" },
  package: { label: "Tour Packages", path: "/packages" },
  destination: { label: "Destinations", path: "/destinations" },
  tirth: { label: "Tirth Yatra", path: "/tirth-yatra" },
  bus: { label: "Bus Booking", path: "/bus" },
  visa: { label: "Visa Services", path: "/visa" },
  guide: { label: "Tour Guides", path: "/travel-guide" },
  blog: { label: "Blog", path: "/blogs" },
  flight: { label: "Flights", path: "/flight" },
};

function docTitle(d: Record<string, string>, type: DetailType): string {
  if (type === "flight") return `${d.from} to ${d.to} Flights`;
  return d.name || d.title || "Detail";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolveSlug(slug);
  if (!r) return {};
  const d = r.doc as Record<string, string>;
  const images = (r.doc.images as string[] | undefined) || [];
  return itemMetadata(d, {
    fallbackTitle: `${docTitle(d, r.type)} — New Global Tour Life`,
    fallbackDescription: d.description || d.excerpt || "",
    fallbackImage: d.image || images[0] || "",
    path: `/${slug}`,
  });
}

export default async function FlatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await resolveSlug(slug);
  if (!r) notFound();

  // Plain-JSON copy of the record, handed straight to the detail component so the
  // page is fully rendered in the server HTML (no client fetch, no empty first paint).
  const initial = serializeDoc(r.doc) as never;
  const raw = r.doc as Record<string, string>;
  const parent = PARENT[r.type];
  const base = SITE_URL.replace(/\/$/, "");

  // Breadcrumbs help Google show the site hierarchy in results.
  const breadcrumb = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: parent.label, item: `${base}${parent.path}` },
      { "@type": "ListItem", position: 3, name: docTitle(raw, r.type), item: `${base}/${slug}` },
    ],
  });

  const faqs = (r.doc.faqs as { question: string; answer: string }[] | undefined) || [];

  const schema = <JsonLd source={raw} extra={[breadcrumb, faqJsonLd(faqs) || ""]} />;

  switch (r.type) {
    case "car":         return (<>{schema}<CarDetailClient idOrSlug={slug} initial={initial} /></>);
    case "hotel":       return (<>{schema}<HotelDetailClient idOrSlug={slug} initial={initial} /></>);
    case "package":     return (<>{schema}<PackageDetailClient idOrSlug={slug} initial={initial} /></>);
    case "destination": return (<>{schema}<DestinationDetailClient idOrSlug={slug} initial={initial} /></>);
    case "tirth":       return (<>{schema}<TirthYatraDetailClient idOrSlug={slug} initial={initial} /></>);
    case "bus":         return (<>{schema}<BusDetailClient idOrSlug={slug} initial={initial} /></>);
    case "visa":        return (<>{schema}<VisaDetailClient idOrSlug={slug} initial={initial} /></>);
    case "guide":       return (<>{schema}<TourGuideDetailClient idOrSlug={slug} initial={initial} /></>);
    case "blog":        return (<>{schema}<BlogDetailClient idOrSlug={slug} initial={initial} /></>);
    case "flight":      return (<>{schema}<FlightDetailClient idOrSlug={slug} initial={initial} /></>);
    default:            notFound();
  }
}
