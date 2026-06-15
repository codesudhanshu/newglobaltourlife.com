import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flight from "@/lib/models/Flight";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const flight = await Flight.findById(id);
  if (!flight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(flight);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const flight = await Flight.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!flight) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(flight);
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  await Flight.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
