import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import propertyModel from "@/models/property.model";
import areaModel from "@/models/area.model";
import userModel from "@/models/user.model";
import { getUserFromToken } from "@/lib/auth";

// Reuse admin verification like in your working developer route
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

function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const [properties, areas, agents] = await Promise.all([
      propertyModel.find({}, "slug updatedAt"),
      areaModel.find({}, "slug updatedAt"),
      userModel.find({}, "slug updatedAt"),
    ]);

    const staticRoutes = [
      { url: "/", changefreq: "monthly", priority: 1.0 },
      { url: "/about", changefreq: "yearly", priority: 1 },
      { url: "/contact", changefreq: "yearly", priority: 1 },
      { url: "/agents", changefreq: "monthly", priority: 1 },
      { url: "/careers", changefreq: "yearly", priority: 1 },
    ];

    const propertyRoutes = properties.map((p) => ({
      url: `/property/${p.slug}`,
      lastmod: p.updatedAt ? formatDate(p.updatedAt) : formatDate(),
      changefreq: "weekly",
      priority: 1,
    }));

    const areaRoutes = areas.map((a) => ({
      url: `/area/${a.slug}`,
      lastmod: a.updatedAt ? formatDate(a.updatedAt) : formatDate(),
      changefreq: "monthly",
      priority: 0.6,
    }));

    const agentRoutes = agents.map((a) => ({
      url: `/agent/${a.slug}`,
      lastmod: a.updatedAt ? formatDate(a.updatedAt) : formatDate(),
      changefreq: "monthly",
      priority: 0.5,
    }));

    const allRoutes = [
      ...staticRoutes,
      ...propertyRoutes,
      ...areaRoutes,
      ...agentRoutes,
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>https://yourdomain.com${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ""}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    const filePath = path.join(process.cwd(), "public", "sitemap.xml");
    fs.writeFileSync(filePath, sitemapContent);

    return NextResponse.json({ success: true, sitemap: sitemapContent });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
