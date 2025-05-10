import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import Amenity from "@/models/amenity.model";
import { UploadApiResponse } from "cloudinary";

// GET all amenities
export async function GET() {
  await connectDB();
  const amenities = await Amenity.find();
  return NextResponse.json(amenities);
}

// POST new amenity (no amenityId from frontend — use Mongo _id)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadRes = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "amenities" }, (err, result) => {
            if (err) return reject(err);
            if (!result)
              return reject(new Error("Upload failed — no result returned."));
            resolve(result);
          })
          .end(buffer);
      }
    );

    // Save amenity to DB
    const newAmenity = await Amenity.create({
      name,
      imageUrl: uploadRes.secure_url,
    });

    return NextResponse.json(newAmenity);
  } catch (error) {
    console.error("POST /api/amenities error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// PUT update amenity name by Mongo _id
export async function PUT(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { id, name } = body;

  if (!id || !name)
    return NextResponse.json({ error: "Missing id or name" }, { status: 400 });

  const updated = await Amenity.findByIdAndUpdate(id, { name }, { new: true });

  if (!updated)
    return NextResponse.json({ error: "Amenity not found" }, { status: 404 });

  return NextResponse.json(updated);
}
