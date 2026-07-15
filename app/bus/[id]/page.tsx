import { connectDB } from "@/lib/db";
import Bus from "@/lib/models/Bus";
import { itemMetadata } from "@/lib/seo";
import BusDetailClient from "./BusDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = null;
  if (/^[a-f\d]{24}$/i.test(p)) d = await Bus.findById(p).lean();
  if (!d) d = await Bus.findOne({ slug: p }).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = (await getRec(id)) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.title || "Bus"} — New Global Tour Life`,
    fallbackDescription: (r?.description as string) || "",
    fallbackImage: (r?.image as string) || "",
    path: `/bus/${id}`,
  });
}

export default function Page() {
  return <BusDetailClient />;
}
