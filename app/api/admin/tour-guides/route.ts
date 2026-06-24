import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TourGuide from "@/lib/models/TourGuide";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL tour guides (including unavailable), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await TourGuide.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}
