import { NextResponse } from "next/server";
import Property from "@/models/property.model";
import dbConnect from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    await dbConnect();

    // First get the current property to find its city/area
    const currentProperty = await Property.findOne({ slug }).lean();

    if (!currentProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Find related properties (same city/area, excluding current property)
    const relatedProperties = await Property.find({
      $or: [
        { areaName: currentProperty.areaName },
        { cityName: currentProperty.cityName },
      ],
      _id: { $ne: currentProperty._id }, // Exclude current property
      verified: true,
    })
      .limit(4) // Limit to 4 properties
      .lean();

    return NextResponse.json({ relatedProperties });
  } catch (error) {
    console.error("Error fetching related properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
