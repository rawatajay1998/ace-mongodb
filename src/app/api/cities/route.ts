import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { Buffer } from "buffer";
import cloudinary from "cloudinary";
import connectDB from "@/lib/db";
import City from "@/models/city.model";
import "@/models/state.model";

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
      { folder: "cities" },
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
  const cities = await City.find().populate("stateId");
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const stateId = formData.get("stateId") as string;
    const file = formData.get("image");

    if (!name || !stateId || !file || typeof file === "string") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadToCloudinary(file as File);
    const newCity = await City.create({
      name,
      stateId,
      cityImageUrl: imageUrl,
    });

    return NextResponse.json(newCity);
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
    const stateId = formData.get("stateId") as string;
    const file = formData.get("image");

    if (!id || !name || !stateId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const city = await City.findById(id);
    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    city.name = name;
    city.stateId = stateId;

    if (
      file &&
      typeof file !== "string" &&
      (file as File).name !== "dummy.jpg"
    ) {
      const imageUrl = await uploadToCloudinary(file as File);
      city.cityImageUrl = imageUrl;
    }

    await city.save();
    return NextResponse.json(city);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
