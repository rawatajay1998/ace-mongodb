// /api/search-suggestions.ts
import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Property from "@/models/property.model";

export async function GET(req: Request) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ locations: [], projects: [] });
  }

  const regex = new RegExp(`^${q}`, "i");

  const [locations, projects] = await Promise.all([
    Property.aggregate([
      {
        $match: {
          $or: [{ city: { $regex: regex } }, { country: { $regex: regex } }],
        },
      },
      {
        $project: {
          _id: 0,
          label: { $concat: ["$city", ", ", "$country"] },
        },
      },
      { $group: { _id: "$label" } },
      { $limit: 5 },
    ]),
    Property.aggregate([
      {
        $match: {
          projectName: { $regex: regex },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$projectName",
        },
      },
      { $group: { _id: "$label" } },
      { $limit: 5 },
    ]),
  ]);

  return NextResponse.json({
    locations: locations.map((l) => l._id),
    projects: projects.map((p) => p._id),
  });
}
