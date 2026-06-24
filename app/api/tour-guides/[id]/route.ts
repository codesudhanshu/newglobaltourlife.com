import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TourGuide from "@/lib/models/TourGuide";
import { isAdminRequest } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  let item = null;
  if (id.match(/^[a-f\d]{24}$/i)) item = await TourGuide.findById(id);
  if (!item) item = await TourGuide.findOne({ slug: id });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const item = await TourGuide.findByIdAndUpdate(id, body, { new: true });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await TourGuide.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
