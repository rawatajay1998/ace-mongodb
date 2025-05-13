import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export const GET = async (req: NextRequest) => {
  await connectDB();

  try {
    // Access query parameters using searchParams
    const search = req.nextUrl.searchParams.get("q");

    if (!search) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    // Search properties by title or description
    const properties = await Property.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    }).limit(10); // Limit results to 10

    return NextResponse.json({ properties });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
