import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category";
import { isAdminRequest } from "@/lib/auth";

// Admin: get ALL categories (including inactive)
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const categories = await Category.find().sort({ order: 1 });
  return NextResponse.json(categories);
}
