import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Package from "@/lib/models/Package";
import { isAdminRequest } from "@/lib/auth";

// Public: get all available packages sorted by order
export async function GET() {
  await connectDB();
  const packages = await Package.find({ available: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(packages);
}

// Admin: create package
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Package.countDocuments();
      body.order = count;
    }
    const pkg = await Package.create(body);
    return NextResponse.json(pkg, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
