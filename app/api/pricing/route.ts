import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Pricing from "@/lib/models/Pricing";
import { isAdminRequest } from "@/lib/auth";

// Public: available pricing rows, optionally filtered by ?category=
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query: Record<string, unknown> = { available: true };
  if (category) query.category = category;
  const rows = await Pricing.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(rows);
}

// Admin: create pricing row
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Pricing.countDocuments();
      body.order = count;
    }
    const row = await Pricing.create(body);
    return NextResponse.json(row, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
