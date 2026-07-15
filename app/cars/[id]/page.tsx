import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";
import { itemMetadata } from "@/lib/seo";
import CarDetailClient from "./CarDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = null;
  if (/^[a-f\d]{24}$/i.test(p)) d = await Car.findById(p).lean();
  if (!d) d = await Car.findOne({ slug: p }).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = (await getRec(id)) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.name || "Car"} — New Global Tour Life`,
    fallbackDescription: (r?.description as string) || "",
    fallbackImage: (r?.image as string) || "",
    path: `/cars/${id}`,
  });
}

export default function Page() {
  return <CarDetailClient />;
}
