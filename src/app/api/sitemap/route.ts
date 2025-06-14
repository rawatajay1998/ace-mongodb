import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SitemapModel from "@/models/Sitemap.model";

export async function GET() {
  try {
    await connectDB();

    const sitemap = await SitemapModel.findOne();
    if (!sitemap || !sitemap.content) {
      return new NextResponse("Sitemap not generated yet", { status: 404 });
    }

    return new NextResponse(sitemap.content, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("Error fetching sitemap:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
