import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL hero slides, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(slides);
}
