import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
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

export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as "admin" | "agent") || "agent";
  const country = formData.get("country") as string;
  const address = formData.get("address") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const about = formData.get("about") as string;
  const imageFile = formData.get("profileImage") as File;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Required fields missing" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let imageUrl = "";

  if (imageFile) {
    imageUrl = await uploadToCloudinary(imageFile);
  }

  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    country,
    address,
    phoneNumber,
    about,
    profileImageUrl: imageUrl,
  });

  return NextResponse.json({ message: "User registered" }, { status: 201 });
}
