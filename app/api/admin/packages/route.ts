import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Package from "@/lib/models/Package";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL packages (including unavailable), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const packages = await Package.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(packages);
}
