import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import Package from "@/lib/models/Package";
import Destination from "@/lib/models/Destination";
import Car from "@/lib/models/Car";
import Hotel from "@/lib/models/Hotel";
import TirthYatra from "@/lib/models/TirthYatra";
import Bus from "@/lib/models/Bus";
import Visa from "@/lib/models/Visa";
import TourGuide from "@/lib/models/TourGuide";

export type DetailType =
  | "car" | "hotel" | "package" | "destination"
  | "tirth" | "bus" | "visa" | "guide" | "blog";

export type ResolvedItem = {
  type: DetailType;
  doc: Record<string, unknown>;
};

// Resolution order — first match wins on a slug/_id collision.
const REGISTRY: { type: DetailType; model: { findOne: (f: object) => { lean: () => Promise<unknown> } } }[] = [
  { type: "package",     model: Package as never },
  { type: "destination", model: Destination as never },
  { type: "blog",        model: Blog as never },
  { type: "car",         model: Car as never },
  { type: "hotel",       model: Hotel as never },
  { type: "tirth",       model: TirthYatra as never },
  { type: "bus",         model: Bus as never },
  { type: "visa",        model: Visa as never },
  { type: "guide",       model: TourGuide as never },
];

// Given a flat URL segment (slug, or a 24-hex ObjectId), find which content
// type it belongs to and return the record. Slug is tried first, then _id.
export async function resolveSlug(param: string): Promise<ResolvedItem | null> {
  if (!param) return null;
  try {
    await connectDB();
  } catch {
    return null;
  }

  const isId = /^[a-f\d]{24}$/i.test(param);

  // Pass 1: match by slug (the canonical flat URL)
  for (const { type, model } of REGISTRY) {
    const doc = await model.findOne({ slug: param }).lean();
    if (doc) return { type, doc: doc as Record<string, unknown> };
  }

  // Pass 2: fall back to _id (legacy links)
  if (isId) {
    for (const { type, model } of REGISTRY) {
      const doc = await model.findOne({ _id: param }).lean();
      if (doc) return { type, doc: doc as Record<string, unknown> };
    }
  }

  return null;
}
