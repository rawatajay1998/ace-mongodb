import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";
import Agent from "@/models/user.model"; // Assuming this is the agent model
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  await connectDB();

  // Get the token from cookies
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the token to check if the user is an admin
  const user = await verifyToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const formData = await req.formData();

  // Helper function to upload an image to Cloudinary
  const uploadToCloudinary = async (
    file: FormDataEntryValue
  ): Promise<string> => {
    if (!file || typeof file === "string") {
      throw new Error("File is missing or not a file");
    }

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

  // Extract agent data from the form
  const fullName = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phoneNumber = formData.get("phoneNumber")?.toString();
  const country = formData.get("country")?.toString();
  const address = formData.get("address")?.toString();
  const about = formData.get("about")?.toString();
  const password = formData.get("password")?.toString(); // Capture password
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

  // Check if the email already exists
  const existingAgentByEmail = await Agent.findOne({ email });
  if (existingAgentByEmail) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  // Check if the phone number already exists
  const existingAgentByPhone = await Agent.findOne({ phoneNumber });
  if (existingAgentByPhone) {
    return NextResponse.json(
      { error: "Phone number already in use" },
      { status: 400 }
    );
  }

  // Upload the profile image to Cloudinary if provided
  let profileImageUrl: string | null = null;
  if (profileImageFile) {
    try {
      profileImageUrl = await uploadToCloudinary(profileImageFile);
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10); // Hashing password

  // Count current agents for a unique number in the slug
  const totalAgents = await Agent.countDocuments();

  // Create a slug like "nicole-daniels-964959"
  const slug = `${fullName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")}-${totalAgents + 1}`;

  // Create the agent object
  const newAgent = new Agent({
    name: fullName,
    email,
    phoneNumber,
    country,
    address,
    about,
    password: hashedPassword, // Save the hashed password
    profileImageUrl: profileImageUrl || "", // Profile image URL can be optional
    role: "agent", // Assigning the role as "agent" by default
    slug,
  });

  try {
    // Save the agent to the database
    await newAgent.save();
    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error) {
    console.error("Error saving agent:", error);
    return NextResponse.json({ error: "Error saving agent" }, { status: 500 });
  }
}
