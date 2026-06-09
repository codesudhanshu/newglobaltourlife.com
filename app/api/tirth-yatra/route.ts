import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TirthYatra from "@/lib/models/TirthYatra";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const items = await TirthYatra.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const item = await TirthYatra.create(body);
  return NextResponse.json(item, { status: 201 });
}
