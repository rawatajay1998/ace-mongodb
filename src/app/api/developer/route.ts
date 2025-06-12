import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Developer from "@/models/developer.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import "@/models/state.model";
import "@/models/city.model";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper for Cloudinary upload
const uploadToCloudinary = async (
  file: FormDataEntryValue
): Promise<string> => {
  if (!file || typeof file === "string") throw new Error("Invalid file");

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const stream = Readable.from(buffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "developers" },
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

// Helper function to verify admin access
const verifyAdmin = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await getUserFromToken(token);
  if (!user || user.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { user };
};

export const POST = async (request: NextRequest) => {
  await connectDB();

  const authResult = await verifyAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const formData = await request.formData();
    const logoFile = formData.get("developerLogo");

    let logoUrl = "";
    if (logoFile && !(typeof logoFile === "string")) {
      logoUrl = await uploadToCloudinary(logoFile);
    }

    const developer = new Developer({
      developerName: formData.get("developerName"),
      state: formData.get("state"),
      city: formData.get("city"),
      developerAbout: formData.get("developerAbout"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      developerLogo: logoUrl,
    });

    await developer.save();

    return NextResponse.json(
      { success: true, data: developer },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = {};

    if (search) {
      query = {
        developerName: { $regex: search, $options: "i" }, // Case-insensitive search
      };
    }

    const developers = await Developer.find(query)
      .populate("state")
      .populate("city")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: developers });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  await connectDB();

  const authResult = await verifyAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const logoFile = formData.get("developerLogo");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      developerName: formData.get("developerName"),
      state: formData.get("state"),
      city: formData.get("city"),
      developerAbout: formData.get("developerAbout"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
    };

    if (logoFile && !(typeof logoFile === "string")) {
      updateData.developerLogo = await uploadToCloudinary(logoFile);
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedDeveloper) {
      return NextResponse.json(
        { success: false, error: "Developer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedDeveloper });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  await connectDB();

  const authResult = await verifyAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    // Get ID from query parameters instead of request body
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const deletedDeveloper = await Developer.findByIdAndDelete(id);

    if (!deletedDeveloper) {
      return NextResponse.json(
        { success: false, error: "Developer not found" },
        { status: 404 }
      );
    }

    // Optionally delete the image from Cloudinary
    if (deletedDeveloper.developerLogo) {
      const publicId = deletedDeveloper.developerLogo
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        // Continue even if Cloudinary deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Developer deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
