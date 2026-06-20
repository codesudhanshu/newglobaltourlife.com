import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

// Public: active hero slides sorted by order
export async function GET() {
  await connectDB();
  const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(slides);
}

// Admin: create slide
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await HeroSlide.countDocuments();
      body.order = count;
    }
    const slide = await HeroSlide.create(body);
    return NextResponse.json(slide, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
