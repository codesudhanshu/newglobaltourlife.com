import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { itemMetadata } from "@/lib/seo";
import HotelDetailClient from "./HotelDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = null;
  if (/^[a-f\d]{24}$/i.test(p)) d = await Hotel.findById(p).lean();
  if (!d) d = await Hotel.findOne({ slug: p }).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = (await getRec(id)) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.name || "Hotel"} — New Global Tour Life`,
    fallbackDescription: (r?.description as string) || "",
    fallbackImage: ((r?.images as unknown as string[]) || [])[0] || "",
    path: `/hotels/${id}`,
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getRec(id) as Record<string, string> | null;
  return (
    <>
      {r?.schemaJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: r.schemaJsonLd }} /> : null}
      <HotelDetailClient />
    </>
  );
}
