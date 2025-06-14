import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import propertyModel from "@/models/property.model";
import areaModel from "@/models/area.model";
import userModel from "@/models/user.model";
import { getUserFromToken } from "@/lib/auth";
import SitemapModel from "@/models/Sitemap.model";

const verifyAdmin = async (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) return { error: "Unauthorized", status: 401 };

  const user = await getUserFromToken(token);
  if (!user || user.role !== "admin")
    return { error: "Forbidden", status: 403 };

  return { user };
};

function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
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
      lastmod: formatDate(p.updatedAt),
      changefreq: "weekly",
      priority: 1,
    }));

    const areaRoutes = areas.map((a) => ({
      url: `/area/${a.slug}`,
      lastmod: formatDate(a.updatedAt),
      changefreq: "monthly",
      priority: 0.6,
    }));

    const agentRoutes = agents.map((a) => ({
      url: `/agent/${a.slug}`,
      lastmod: formatDate(a.updatedAt),
      changefreq: "monthly",
      priority: 0.5,
    }));

    const allRoutes = [
      ...staticRoutes,
      ...propertyRoutes,
      ...areaRoutes,
      ...agentRoutes,
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `
  <url>
    <loc>https://aceeliteproperties.com${r.url}</loc>
    ${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ""}
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    // Save or update sitemap in DB
    await SitemapModel.findOneAndUpdate(
      {},
      { content: sitemapXml },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Sitemap generated." });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
