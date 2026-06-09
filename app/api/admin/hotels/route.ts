import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const hotels = await Hotel.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(hotels);
}
