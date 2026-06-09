import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";
import { isAdminRequest } from "@/lib/auth";

// Public: get all available cars sorted by order
export async function GET() {
  await connectDB();
  const cars = await Car.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(cars);
}

// Admin: create car
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Car.countDocuments();
      body.order = count;
    }
    const car = await Car.create(body);
    return NextResponse.json(car, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
