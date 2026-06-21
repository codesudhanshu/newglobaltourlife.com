import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Visa from "@/lib/models/Visa";
import { isAdminRequest } from "@/lib/auth";

// Public: available visa services sorted by order
export async function GET() {
  await connectDB();
  const items = await Visa.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

// Admin: create
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Visa.countDocuments();
      body.order = count;
    }
    const item = await Visa.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
