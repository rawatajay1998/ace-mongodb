import Blog from "@/models/blog.model";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (
  _req: Request,
  { params }: { params: { slug: string } }
) => {
  await connectDB();

  try {
    const currentBlog = await Blog.findOne({ slug: params.slug });

    if (!currentBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const latestBlogs = await Blog.find({ slug: { $ne: params.slug } }) // exclude current
      .sort({ date: -1 })
      .limit(5);

    return NextResponse.json({
      data: {
        currentBlog,
        latestBlogs,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
