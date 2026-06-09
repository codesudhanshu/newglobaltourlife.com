import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";
import Car from "@/lib/models/Car";
import Contact from "@/lib/models/Contact";
import Category from "@/lib/models/Category";
import Hotel from "@/lib/models/Hotel";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const [blogs, cars, contacts, unreadContacts, categories, hotels] = await Promise.all([
    Blog.countDocuments(),
    Car.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ read: false }),
    Category.countDocuments({ active: true }),
    Hotel.countDocuments({ available: true }),
  ]);
  return NextResponse.json({ blogs, cars, contacts, unreadContacts, categories, hotels });
}
