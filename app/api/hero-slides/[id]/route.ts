import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSlide from "@/lib/models/HeroSlide";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const slide = await HeroSlide.findById(id);
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(slide);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const slide = await HeroSlide.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(slide);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  await HeroSlide.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
