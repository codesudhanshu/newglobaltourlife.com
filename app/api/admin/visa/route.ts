import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Visa from "@/lib/models/Visa";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL visa services, sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await Visa.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}
