import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { image, folder } = await request.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });
    const url = await uploadImage(image, folder || "new-global-tour-life");
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
