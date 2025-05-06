// app/api/agents/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);

  console.log(user);
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();

  const profileImageFile = formData.get("profileImage") as File;
  const arrayBuffer = await profileImageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadRes = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "agents" }, (err, result) => {
        if (err || !result) reject(err || new Error("Upload failed"));
        resolve(result);
      })
      .end(buffer);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = (uploadRes as any).secure_url;

  const newUser = new User({
    name: `${formData.get("firstname")} ${formData.get("lastname")}`,
    email: formData.get("email"),
    password: await bcrypt.hash(formData.get("password") as string, 10),
    role: "agent",
    profileImageUrl: imageUrl,
    address: formData.get("address"),
    country: formData.get("country"),
    phoneNumber: formData.get("phone"),
    dob: formData.get("dob"), // optionally handle DOB
  });

  await newUser.save();

  return NextResponse.json({ success: true, user: newUser });
}
