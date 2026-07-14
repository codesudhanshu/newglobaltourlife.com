import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageSeo from "@/lib/models/PageSeo";
import { isAdminRequest } from "@/lib/auth";

// GET: all SEO records (admin). Optional ?key= to fetch one.
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const key = new URL(request.url).searchParams.get("key");
  if (key) {
    const doc = await PageSeo.findOne({ pageKey: key });
    return NextResponse.json(doc || {});
  }
  const docs = await PageSeo.find().sort({ pageKey: 1 });
  return NextResponse.json(docs);
}

// PUT: upsert a page's SEO by pageKey.
export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await request.json();
  const { pageKey, ...fields } = body;
  if (!pageKey) return NextResponse.json({ error: "pageKey required" }, { status: 400 });

  const doc = await PageSeo.findOneAndUpdate(
    { pageKey },
    { $set: { pageKey, ...fields } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return NextResponse.json(doc);
}
