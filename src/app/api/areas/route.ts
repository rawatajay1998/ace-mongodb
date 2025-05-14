import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { Buffer } from "buffer";
import cloudinary from "cloudinary";
import connectDB from "@/lib/db";
import Area from "@/models/area.model";
import "@/models/city.model";

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

export async function GET() {
  await connectDB();
  const areas = await Area.find().populate("cityId");
  return NextResponse.json(areas);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const cityId = formData.get("cityId") as string;
    const file = formData.get("image");

    if (!name || !cityId || !file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(file as File);
    const newArea = await Area.create({ name, cityId, areaImageUrl: imageUrl });

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

    if (
      file &&
      typeof file !== "string" &&
      (file as File).name !== "dummy.jpg"
    ) {
      const imageUrl = await uploadToCloudinary(file as File);
      area.areaImageUrl = imageUrl;
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

    // Optional: Delete image from Cloudinary
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
