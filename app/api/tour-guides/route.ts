import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TourGuide from "@/lib/models/TourGuide";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const items = await TourGuide.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const item = await TourGuide.create(body);
  return NextResponse.json(item, { status: 201 });
}
