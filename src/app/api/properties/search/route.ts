import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Property from "@/models/property.model";
import { z } from "zod";

// Define input validation schema
const searchSchema = z.object({
  type: z.string().optional(),
  location: z.string().optional(),
  projectName: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minSize: z.coerce.number().min(0).optional(),
  maxSize: z.coerce.number().min(0).optional(),
  beds: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(request: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const parsed = searchSchema.parse({
      ...params,
      amenities: searchParams.getAll("amenities"),
    });

    const {
      type,
      location,
      projectName,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      amenities = [],
      beds,
      bathrooms,
      page,
      limit,
    } = parsed;

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {
      verified: true,
    };

    // Match property type
    if (type) query.propertyType = type;

    // Match project name
    if (projectName?.trim()) {
      query.projectName = { $regex: projectName.trim(), $options: "i" };
    }

    // Safe $regex on location using RegExp object
    if (typeof location === "string" && location.trim()) {
      const regex = new RegExp(location.trim(), "i");
      query.$or = [{ city: regex }, { country: regex }];
    }

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.propertyPrice = {};
      if (minPrice !== undefined) query.propertyPrice.$gte = minPrice;
      if (maxPrice !== undefined) query.propertyPrice.$lte = maxPrice;
    }

    // Size filtering
    if (minSize !== undefined || maxSize !== undefined) {
      query.areaSize = {};
      if (minSize !== undefined) query.areaSize.$gte = minSize;
      if (maxSize !== undefined) query.areaSize.$lte = maxSize;
    }

    // Amenities filter
    if (amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    if (beds !== undefined) query.beds = { $gte: beds };
    if (bathrooms !== undefined) query.bathrooms = { $gte: bathrooms };

    const properties = await Property.find(query)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Property.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("[SEARCH_API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Invalid request or server error" },
      { status: 500 }
    );
  }
}
