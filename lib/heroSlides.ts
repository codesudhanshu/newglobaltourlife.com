import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import type { HeroSlideData } from "@/components/Hero";

// Server-side read of the active hero slides, so the homepage banner ships in
// the initial HTML instead of arriving after a client fetch.
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  try {
    await connectDB();
    const rows = await HeroSlide.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .select("image mobileImage imageAlt heading sub")
      .lean<{ image?: string; mobileImage?: string; imageAlt?: string; heading?: string; sub?: string }[]>();
    return rows
      .filter((r) => !!r.image)
      .map((r) => ({
        image: r.image || "",
        mobileImage: r.mobileImage || "",
        imageAlt: r.imageAlt || "",
        heading: r.heading || "",
        sub: r.sub || "",
      }));
  } catch {
    return [];
  }
}
