import { connectDB } from "@/lib/db";
import Destination from "@/lib/models/Destination";
import { itemMetadata } from "@/lib/seo";
import DestinationDetailClient from "./DestinationDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = await Destination.findOne({ slug: p }).lean();
  if (!d && /^[a-f\d]{24}$/i.test(p)) d = await Destination.findById(p).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = (await getRec(slug)) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.name || "Destination"} — New Global Tour Life`,
    fallbackDescription: (r?.description as string) || "",
    fallbackImage: (r?.image as string) || "",
    path: `/destinations/${slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getRec(slug) as Record<string, string> | null;
  return (
    <>
      {r?.schemaJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: r.schemaJsonLd }} /> : null}
      <DestinationDetailClient />
    </>
  );
}
