import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import "@/models/amenity.model";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  try {
    const property = await Property.findOne({ slug: params.slug })
      .populate("amenities")
      .lean();

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
