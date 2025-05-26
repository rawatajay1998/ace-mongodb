import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { Buffer } from "buffer";
import cloudinary from "cloudinary";
import connectDB from "@/lib/db";
import Area from "@/models/area.model";
import mongoose from "mongoose";
import "@/models/city.model";

// Slug generation function
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "areas" },
      (error, result) => {
        if (error || !result)
          return reject(error || new Error("Upload failed"));
        resolve(result);
      }
    );
    stream.pipe(uploadStream);
  });

  return result.secure_url;
};

export const GET = async (req: Request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    let query = {};

    if (city) {
      if (mongoose.Types.ObjectId.isValid(city)) {
        query = { cityId: new mongoose.Types.ObjectId(city) };
      } else {
        return NextResponse.json(
          { error: "Invalid state ID" },
          { status: 400 }
        );
      }
    }

    const areas = await Area.find(query).populate("cityId");
    return NextResponse.json(areas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const cityId = formData.get("cityId") as string;
    const file = formData.get("image");

    if (!name || !cityId || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Skip upload if it's a dummy file
    let imageUrl = "";
    if (file && typeof file !== "string" && file.name !== "dummy.jpg") {
      imageUrl = await uploadToCloudinary(file as File);
    }

    const newArea = await Area.create({
      name,
      cityId,
      areaImageUrl: imageUrl || undefined,
      slug: generateSlug(name),
    });

    return NextResponse.json(newArea);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const cityId = formData.get("cityId") as string;
    const file = formData.get("image");

    if (!id || !name || !cityId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const area = await Area.findById(id);
    if (!area)
      return NextResponse.json({ error: "Area not found" }, { status: 404 });

    area.name = name;
    area.cityId = cityId;
    area.slug = generateSlug(name);

    if (file && typeof file !== "string" && file.name !== "dummy.jpg") {
      // Delete old image if exists
      if (area.areaImageUrl) {
        const publicId = area.areaImageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.v2.uploader.destroy(`areas/${publicId}`);
        }
      }
      // Upload new image
      area.areaImageUrl = await uploadToCloudinary(file as File);
    }

    await area.save();
    return NextResponse.json(area);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Area ID is required" },
        { status: 400 }
      );
    }

    const deletedArea = await Area.findByIdAndDelete(id);

    if (!deletedArea) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (deletedArea.areaImageUrl) {
      const publicId = deletedArea.areaImageUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.v2.uploader.destroy(`areas/${publicId}`);
      }
    }

    return NextResponse.json({ message: "Area deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
