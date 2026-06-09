import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL cars (including unavailable), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const cars = await Car.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(cars);
}
