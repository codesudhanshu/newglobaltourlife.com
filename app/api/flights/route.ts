import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flight from "@/lib/models/Flight";
import { isAdminRequest } from "@/lib/auth";

// Public: get all available flight deals sorted by order
export async function GET() {
  await connectDB();
  const flights = await Flight.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(flights);
}

// Admin: create flight deal
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Flight.countDocuments();
      body.order = count;
    }
    const flight = await Flight.create(body);
    return NextResponse.json(flight, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
