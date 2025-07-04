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
  file: Buffer,
  folder = "blogs"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const readable = new Readable();
    readable.push(file);
    readable.push(null);
    readable.pipe(uploadStream);
  });
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

// Process content images and upload to Cloudinary
const processContentImages = async (content: string): Promise<string> => {
  if (!content.includes("<img")) return content;

  try {
    const $ = cheerio.load(content);
    const images = $("img").toArray();

    await Promise.all(
      images.map(async (img) => {
        const src = $(img).attr("src");
        if (!src || src.includes("res.cloudinary.com")) return;

        try {
          let buffer: Buffer;
          if (src.startsWith("data:")) {
            const base64Data = src.split(",")[1];
            buffer = Buffer.from(base64Data, "base64");
          } else {
            const response = await fetch(src);
            buffer = Buffer.from(await response.arrayBuffer());
          }

          const cloudinaryUrl = await uploadToCloudinary(
            buffer,
            "blogs/content"
          );
          $(img).attr("src", cloudinaryUrl);
          $(img).removeAttr("srcset");
        } catch (error) {
          console.error("Failed to process image:", error);
        }
      })
    );

    return $.html();
  } catch (error) {
    console.error("Content processing failed:", error);
    return content;
  }
};

// Extract Cloudinary URLs from HTML content
const extractCloudinaryUrls = (html: string): string[] => {
  const urls: string[] = [];
  const $ = cheerio.load(html);
  $("img").each((_, img) => {
    const src = $(img).attr("src");
    if (src?.includes("res.cloudinary.com")) {
      urls.push(src);
    }
  });
  return urls;
};

// Delete multiple images from Cloudinary
const deleteCloudinaryImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(async (url) => {
      try {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(`Failed to delete image ${url}:`, error);
      }
    })
  );
};

// Verify admin access
const verifyAdmin = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;
  if (!token) return { error: "Unauthorized", status: 401 };

  const user = await getUserFromToken(token);
  if (!user || user.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { user };
};

// GET all blogs
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
      data: { blogs, total, page, limit },
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

// CREATE new blog
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
    const rawContent = formData.get("content")?.toString() || "";

    if (!thumbnailFile || typeof thumbnailFile === "string") {
      return NextResponse.json(
        { success: false, error: "Valid thumbnail image is required" },
        { status: 400 }
      );
    }

    // Process content and thumbnail in parallel
    const [processedContent, thumbnailUrl] = await Promise.all([
      processContentImages(rawContent),
      uploadToCloudinary(
        Buffer.from(await thumbnailFile.arrayBuffer()),
        "blogs/thumbs"
      ),
    ]);

    const blog = new Blog({
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      content: processedContent,
      thumbnail: thumbnailUrl,
      slug: generateSlug(formData.get("title")?.toString() || ""),
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

// UPDATE existing blog
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
    const newContent = formData.get("content")?.toString() || "";

    const originalBlog = await Blog.findById(id);
    if (!originalBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Process content and handle thumbnail in parallel
    const [processedContent, thumbnailUrl] = await Promise.all([
      processContentImages(newContent),
      thumbnailFile && typeof thumbnailFile !== "string"
        ? (async () => {
            // Delete old thumbnail first
            if (originalBlog.thumbnail) {
              await deleteCloudinaryImages([originalBlog.thumbnail]);
            }
            return uploadToCloudinary(
              Buffer.from(await thumbnailFile.arrayBuffer()),
              "blogs/thumbs"
            );
          })()
        : Promise.resolve(undefined),
    ]);

    // Find and delete removed images
    const originalImages = extractCloudinaryUrls(originalBlog.content);
    const newImages = extractCloudinaryUrls(processedContent);
    const removedImages = originalImages.filter(
      (url) => !newImages.includes(url)
    );
    await deleteCloudinaryImages(removedImages);

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        metaTitle: formData.get("metaTitle"),
        metaDescription: formData.get("metaDescription"),
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        content: processedContent,
        thumbnail: thumbnailUrl || originalBlog.thumbnail,
        slug: generateSlug(formData.get("title") as string),
      },
      { new: true }
    );

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

// DELETE blog
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

    // Delete all associated images
    const imagesToDelete = [
      deletedBlog.thumbnail,
      ...extractCloudinaryUrls(deletedBlog.content),
    ].filter(Boolean) as string[];

    await deleteCloudinaryImages(imagesToDelete);

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
