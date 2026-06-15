import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flight from "@/lib/models/Flight";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL flights (including unavailable), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const flights = await Flight.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(flights);
}
