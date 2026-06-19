import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { isAdminRequest } from "@/lib/auth";

// Public: user submits contact form
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, message } = body;
    if (!name || !message || (!email && !phone)) {
      return NextResponse.json({ error: "Name, message, and either email or phone are required" }, { status: 400 });
    }
    const contact = await Contact.create({ name, email, phone, message });
    return NextResponse.json({ success: true, id: contact._id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Admin: list all contacts
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return NextResponse.json(contacts);
}
