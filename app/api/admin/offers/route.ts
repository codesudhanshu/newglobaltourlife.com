import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/lib/models/Offer";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL offers (including inactive), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const offers = await Offer.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(offers);
}
