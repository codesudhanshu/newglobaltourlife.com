import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const hotels = await Hotel.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(hotels);
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      body.order = await Hotel.countDocuments();
    }
    const hotel = await Hotel.create(body);
    return NextResponse.json(hotel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
