import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Announcement from "@/lib/models/Announcement";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  let doc = await Announcement.findOne();
  if (!doc) doc = await Announcement.create({ text: "Special discount on tour packages — Call +91-9131727811 to book!", active: true, emoji: "🎉" });
  return NextResponse.json(doc);
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await request.json();
  let doc = await Announcement.findOne();
  if (!doc) {
    doc = await Announcement.create(body);
  } else {
    doc = await Announcement.findByIdAndUpdate(doc._id, body, { new: true });
  }
  return NextResponse.json(doc);
}
