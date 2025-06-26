import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Blog from "@/models/blog.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

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
      { folder: "blogs" }, // Changed folder to 'blogs'
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

const generateSlug = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

export const GET = async (req: NextRequest) => {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        total,
        page,
        limit,
      },
    });
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
    const thumbnailFile = formData.get("thumbnailFile");

    if (!thumbnailFile) {
      return NextResponse.json(
        { success: false, error: "Thumbnail image is required" },
        { status: 400 }
      );
    }

    const title = formData.get("title")?.toString() || "";
    const slug = generateSlug(title);

    // Check if slug already exists
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    const thumbnailUrl = await uploadToCloudinary(thumbnailFile);

    const blog = new Blog({
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      title,
      subtitle: formData.get("subtitle"),
      content: formData.get("content"),
      thumbnail: thumbnailUrl,
      slug,
    });

    await blog.save();

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
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
    const thumbnailFile = formData.get("thumbnailFile");

    const title = formData.get("title")?.toString() || "";
    const slug = generateSlug(title);

    // Check if another blog already uses this slug
    const existing = await Blog.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      title,
      subtitle: formData.get("subtitle"),
      content: formData.get("content"),
      slug,
    };

    if (thumbnailFile && typeof thumbnailFile !== "string") {
      updateData.thumbnail = await uploadToCloudinary(thumbnailFile);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBlog });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Optionally delete the image from Cloudinary
    if (deletedBlog.thumbnail) {
      const publicId = deletedBlog.thumbnail
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
      message: "Blog deleted successfully",
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
