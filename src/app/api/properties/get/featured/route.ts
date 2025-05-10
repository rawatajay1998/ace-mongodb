import { NextResponse } from "next/server";
import Property from "@/models/property.model";
import Category from "@/models/category.model";
import "@/models/user.model";

export async function GET() {
  try {
    // Find the category ObjectId for "villa"
    const categoryDoc = await Category.findOne({
      name: { $regex: /^Featured$/i }, // case-insensitive match for "Featured"
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch only featured properties for the "villa" category
    const properties = await Property.find({
      propertyCategory: categoryDoc._id,
      verified: true,
    }).populate("postedBy", "name profileImageUrl email");

    return NextResponse.json({ data: properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
