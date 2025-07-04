import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: Request) => {
  try {
    const { base64 } = await req.json();
    if (!base64) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const uploadRes = await cloudinary.uploader.upload(base64, {
      folder: "blogs/content",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
