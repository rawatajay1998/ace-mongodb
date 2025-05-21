// /app/api/properties/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import propertyModel from "@/models/property.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    const searchableFields = ["projectName", "city", "status", "price", "beds"];

    searchableFields.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        if (field === "price" || field === "beds") {
          filters[field] = parseInt(value);
        } else {
          filters[field] = { $regex: value, $options: "i" }; // case-insensitive partial match
        }
      }
    });

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      propertyModel.find(filters).skip(skip).limit(pageSize),
      propertyModel.countDocuments(filters),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
