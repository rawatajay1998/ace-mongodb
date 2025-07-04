import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Blog from "@/models/blog.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import * as cheerio from "cheerio";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper for Cloudinary upload
const uploadToCloudinary = async (
  file: FormDataEntryValue | Buffer,
  folder = "blogs"
): Promise<string> => {
  if (!file || (typeof file === "string" && !file.startsWith("data:"))) {
    throw new Error("Invalid file");
  }

  let buffer: Buffer;
  if (file instanceof Buffer) {
    buffer = file;
  } else {
    buffer = Buffer.from(await (file as File).arrayBuffer());
  }

  const stream = Readable.from(buffer);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
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

// Helper to process content images
const processContentImages = async (content: string): Promise<string> => {
  const $ = cheerio.load(content);
  const images = $("img").toArray();

  for (const img of images) {
    const src = $(img).attr("src");
    if (!src) continue;

    // Skip if already a Cloudinary URL
    if (src.includes("res.cloudinary.com")) continue;

    // Upload base64 or blob images
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      try {
        let file: Buffer;
        if (src.startsWith("data:")) {
          const base64Data = src.split(",")[1];
          file = Buffer.from(base64Data, "base64");
        } else {
          const response = await fetch(src);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          file = Buffer.from(arrayBuffer);
        }

        const cloudinaryUrl = await uploadToCloudinary(file, "blogs/content");
        $(img).attr("src", cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Keep original src if upload fails
      }
    }
  }

  return $.html();
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
    const content = formData.get("content")?.toString() || "";

    // Check if slug already exists
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }

    // Process content images
    const processedContent = await processContentImages(content);

    // Upload thumbnail
    const thumbnailUrl = await uploadToCloudinary(thumbnailFile);

    const blog = new Blog({
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      title,
      subtitle: formData.get("subtitle"),
      content: processedContent,
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
    const content = formData.get("content")?.toString() || "";

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

    // Process content images
    const processedContent = await processContentImages(content);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      title,
      subtitle: formData.get("subtitle"),
      content: processedContent,
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

    // Delete thumbnail from Cloudinary
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
      }
    }

    // Find and delete content images from Cloudinary
    const contentImages =
      deletedBlog.content.match(/res\.cloudinary\.com\/[^"\s]+/g) || [];
    for (const imgUrl of contentImages) {
      const publicId = imgUrl.split("/").slice(-2).join("/").split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting content image:", cloudinaryError);
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
