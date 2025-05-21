import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";
import Agent from "@/models/user.model";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import { Readable } from "stream";
import { nanoid } from "nanoid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectDB();

  // Token validation
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const formData = await req.formData();

  // Helper for Cloudinary upload
  const uploadToCloudinary = async (
    file: FormDataEntryValue
  ): Promise<string> => {
    if (!file || typeof file === "string") throw new Error("Invalid file");

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "agents" },
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

  // Extract form values
  const fullName = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phoneNumber = formData.get("phoneNumber")?.toString();
  const country = formData.get("country")?.toString();
  const address = formData.get("address")?.toString();
  const about = formData.get("about")?.toString();
  const password = formData.get("password")?.toString();
  const profileImageFile = formData.get("profileImage");

  // Validate required fields
  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !country ||
    !address ||
    !about ||
    !password
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check for existing email / phone
  const [existingAgentByEmail, existingAgentByPhone] = await Promise.all([
    Agent.findOne({ email }),
    Agent.findOne({ phoneNumber }),
  ]);

  if (existingAgentByEmail) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  if (existingAgentByPhone) {
    return NextResponse.json(
      { error: "Phone number already in use" },
      { status: 400 }
    );
  }

  // Upload image if present
  let profileImageUrl: string | null = null;
  if (profileImageFile) {
    try {
      profileImageUrl = await uploadToCloudinary(profileImageFile);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 }
      );
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate modern slug
  const baseSlug = fullName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  let finalSlug = baseSlug;

  const existingSlug = await Agent.findOne({ slug: baseSlug });
  if (existingSlug) {
    finalSlug = `${baseSlug}-${nanoid(6)}`;
  }

  // Create new agent
  const newAgent = new Agent({
    name: fullName,
    email,
    phoneNumber,
    country,
    address,
    about,
    password: hashedPassword,
    profileImageUrl: profileImageUrl || "",
    role: "agent",
    slug: finalSlug,
  });

  try {
    await newAgent.save();
    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error) {
    console.error("Error saving agent:", error);
    return NextResponse.json(
      { error: "Failed to save agent" },
      { status: 500 }
    );
  }
}
