import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Announcement from "@/lib/models/Announcement";

export async function GET() {
  await connectDB();
  let doc = await Announcement.findOne();
  if (!doc) {
    doc = await Announcement.create({
      text: "Special discount on tour packages — Call +91-9131727811 to book!",
      active: true,
      emoji: "🎉",
    });
  }
  return NextResponse.json(doc);
}
