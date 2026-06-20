import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Destination from "@/lib/models/Destination";
import { isAdminRequest } from "@/lib/auth";

// Public: get active destinations, optional ?region=India|World or ?slug=<slug>
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const slug = searchParams.get("slug");
  const query: Record<string, unknown> = { active: true };
  if (region === "India" || region === "World") query.region = region;
  if (slug) query.slug = slug;
  const destinations = await Destination.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(destinations);
}

// Admin: create destination
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Destination.countDocuments();
      body.order = count;
    }
    const destination = await Destination.create(body);
    return NextResponse.json(destination, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
