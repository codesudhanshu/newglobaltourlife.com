import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { isAdminRequest } from "@/lib/auth";

// Public: get all published blogs sorted by order
export async function GET() {
  await connectDB();
  const blogs = await Blog.find({ published: true }).sort({ order: 1, createdAt: -1 });
  return NextResponse.json(blogs);
}

// Admin: create blog
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    // Auto-generate slug from title
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    // Auto-assign order if not provided
    if (body.order === undefined) {
      const count = await Blog.countDocuments();
      body.order = count;
    }
    const blog = await Blog.create(body);
    return NextResponse.json(blog, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
