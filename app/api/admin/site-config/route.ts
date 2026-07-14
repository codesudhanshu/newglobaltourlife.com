import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteConfig from "@/lib/models/SiteConfig";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  let doc = await SiteConfig.findOne();
  if (!doc) doc = await SiteConfig.create({});
  return NextResponse.json(doc);
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await request.json();
  if (typeof body.orgSameAs === "string") {
    body.orgSameAs = body.orgSameAs.split(",").map((s: string) => s.trim()).filter(Boolean);
  }
  let doc = await SiteConfig.findOne();
  if (!doc) doc = await SiteConfig.create(body);
  else doc = await SiteConfig.findByIdAndUpdate(doc._id, body, { new: true });
  return NextResponse.json(doc);
}
