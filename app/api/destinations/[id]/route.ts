import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Destination from "@/lib/models/Destination";
import { isAdminRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const destination = await Destination.findById(id);
  if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(destination);
}

export async function PUT(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const destination = await Destination.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(destination);
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  await Destination.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
