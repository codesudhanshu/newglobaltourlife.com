import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/lib/models/Offer";
import { isAdminRequest } from "@/lib/auth";

// Public: active offers, optional ?category=Flights|Hotels|Holidays|Buses
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query: Record<string, unknown> = { active: true };
  if (category && ["Flights", "Hotels", "Holidays", "Buses"].includes(category)) query.category = category;
  const offers = await Offer.find(query).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(offers);
}

// Admin: create offer
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (body.order === undefined) {
      const count = await Offer.countDocuments();
      body.order = count;
    }
    const offer = await Offer.create(body);
    return NextResponse.json(offer, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
