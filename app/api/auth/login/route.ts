import { NextResponse } from "next/server";
import { verifyAdminCredentials, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = signToken({ email, role: "admin" });
    return NextResponse.json({ token, email });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
