import React from "react";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import "./blog.css";

type BlogType = {
  _id: string;
  title: string;
  metaDescription: string;
  thumbnail: string;
  content: string;
  date: string;
  slug?: string;
};

export default async function SingleBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  let blog: BlogType | null = null;
  let latestBlogs: BlogType[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`
    );

    if (!res.ok) throw new Error("Blog not found");

    const json = await res.json();
    blog = json.data.currentBlog;
    latestBlogs = json.data.latestBlogs;
  } catch (err) {
    console.error("Failed to load blog:", err);
    return notFound(); // Show 404 page
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Blog content */}
      <div className="md:col-span-2">
        <div className="overflow-hidden rounded-2xl shadow-md mb-8">
          <Image
            src={blog.thumbnail || "/default-thumbnail.jpg"}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h1 className="text-3xl mb-4 text-gray-900">{blog.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {dayjs(blog.date).format("DD MMMM YYYY")}
        </p>

        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Sidebar */}
      <aside className="md:col-span-1 shadow-sm p-4 sidebar_blogs">
        <h2 className="text-2xl  mb-6 text-gray-900 aside__title">
          Latest Blogs
        </h2>
        <div className="space-y-4">
          {latestBlogs.map((b) => (
            <Link key={b._id} href={`/blogs/${b.slug}`} className="block group">
              <div className="flex items-center rounded-xl hover:bg-gray-50 transition">
                <div className="flex-shrink-0">
                  <Image
                    src={b.thumbnail || "/default-thumbnail.jpg"}
                    alt={b.title}
                    width={80}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-base  text-gray-800 group-hover:underline">
                    {b.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {dayjs(b.date).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
