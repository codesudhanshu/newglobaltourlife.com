import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category";
import { isAdminRequest } from "@/lib/auth";

// Public: get active categories sorted by order
export async function GET() {
  await connectDB();
  const categories = await Category.find({ active: true }).sort({ order: 1 });
  return NextResponse.json(categories);
}

// Admin: create category
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (body.order === undefined) {
      body.order = await Category.countDocuments();
    }
    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
