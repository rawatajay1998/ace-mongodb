import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function GET(req: NextRequest) {
  await connectDB();
  const searchQuery = req.nextUrl.searchParams.get("q");

  if (!searchQuery || searchQuery.trim() === "") {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const results = await Property.find({
      projectName: { $regex: `^${searchQuery}`, $options: "i" }, // prefix match
    })
      .limit(10)
      .maxTimeMS(200)
      .select("_id projectName");

    return NextResponse.json({ results }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch properties", details: err },
      { status: 500 }
    );
  }
}
