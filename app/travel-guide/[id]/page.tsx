import { connectDB } from "@/lib/db";
import TourGuide from "@/lib/models/TourGuide";
import { itemMetadata } from "@/lib/seo";
import TourGuideDetailClient from "./TourGuideDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = null;
  if (/^[a-f\d]{24}$/i.test(p)) d = await TourGuide.findById(p).lean();
  if (!d) d = await TourGuide.findOne({ slug: p }).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = (await getRec(id)) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.name || "Tour Guide"} — New Global Tour Life`,
    fallbackDescription: (r?.description as string) || "",
    fallbackImage: (r?.image as string) || "",
    path: `/travel-guide/${id}`,
  });
}

export default function Page() {
  return <TourGuideDetailClient />;
}
