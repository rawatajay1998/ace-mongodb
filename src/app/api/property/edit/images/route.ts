// app/api/property/edit/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import cloudinary from "cloudinary";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Image Upload Handler
export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  const slug = formData.get("slug") as string;
  const key = formData.get("key") as string;
  const file = formData.get("file") as File;

  if (!slug || !key || !file) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "properties" },
      (err, res) => {
        if (err || !res) return reject(err || new Error("Upload failed"));
        resolve(res);
      }
    );
    stream.pipe(uploadStream);
  });

  const imageUrl = result.secure_url;

  const property = await Property.findOne({ slug });
  if (!property)
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );

  if (key === "thumbnailImage" || key === "bannerImage") {
    property[key] = imageUrl;
  } else {
    property[key].push(imageUrl);
  }

  await property.save();

  return NextResponse.json({ success: true, url: imageUrl });
}

// Get Existing Images
export async function GET(req: NextRequest) {
  await connectDB();
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug)
    return NextResponse.json(
      { success: false, message: "Missing slug" },
      { status: 400 }
    );

  const property = await Property.findOne({ slug });

  if (!property) {
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, property });
}

// Delete Image
// Delete Image
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { slug, key, url } = await req.json();

  if (!slug || !key || !url) {
    return NextResponse.json(
      { success: false, message: "Missing data" },
      { status: 400 }
    );
  }

  const property = await Property.findOne({ slug });
  if (!property) {
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );
  }

  // Extract Cloudinary public_id from URL
  const publicId = url.split("/").slice(-2).join("/").split(".")[0]; // folder/filename (without extension)

  try {
    await cloudinary.v2.uploader.destroy(`properties/${publicId}`);
  } catch (err) {
    console.error("Error deleting from Cloudinary:", err);
  }

  if (key === "thumbnailImage" || key === "bannerImage") {
    property[key] = "";
  } else {
    property[key] = property[key].filter((img: string) => img !== url);
  }

  await property.save();

  return NextResponse.json({ success: true });
}
