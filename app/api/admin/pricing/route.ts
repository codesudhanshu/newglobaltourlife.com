import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pricing from "@/lib/models/Pricing";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL pricing rows, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const rows = await Pricing.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(rows);
}
