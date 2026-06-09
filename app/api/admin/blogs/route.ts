import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL blogs (including unpublished), sorted by order
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const blogs = await Blog.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(blogs);
}
