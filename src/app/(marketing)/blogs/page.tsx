"use client";

import React, { useEffect, useState } from "react";
import { Image, Pagination, Spin } from "antd";
import Link from "next/link";
import dayjs from "dayjs";

type BlogType = {
  _id: string;
  title: string;
  metaDescription: string;
  thumbnail: string;
  date: string;
  slug: string;
};

const pageSize = 9;

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=${pageSize}`);
      const data = await res.json();
      setBlogs(data.data.blogs);
      setTotal(data.data.total);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Blog</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                href={`/blogs/${blog.slug}`} // Or `/blog/${slug}` if you have slugs
                key={blog._id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <Image
                  src={blog.thumbnail || "/default-thumbnail.jpg"}
                  alt={blog.title}
                  width={600}
                  height={250}
                  style={{ objectFit: "cover", width: "100%", height: "250px" }}
                  preview={false}
                  className="w-full"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {dayjs(blog.date).format("DD MMM, YYYY")}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {blog.metaDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
