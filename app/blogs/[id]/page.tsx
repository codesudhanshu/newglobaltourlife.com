import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { itemMetadata } from "@/lib/seo";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

async function getRec(p: string) {
  await connectDB();
  let d = null;
  if (/^[a-f\d]{24}$/i.test(p)) d = await Blog.findById(p).lean();
  if (!d) d = await Blog.findOne({ slug: p }).lean();
  return d as Record<string, unknown> | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getRec(id) as Record<string, string> | null;
  return itemMetadata(r, {
    fallbackTitle: `${r?.title || "Blog"} — New Global Tour Life`,
    fallbackDescription: (r?.excerpt as string) || (r?.description as string) || "",
    fallbackImage: (r?.image as string) || "",
    path: `/blogs/${id}`,
  });
}

export default function Page() {
  return <BlogDetailClient />;
}
