import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // ✅ import the connection
import Property from "@/models/property.model";
import Category from "@/models/category.model";
import "@/models/user.model";

export async function GET() {
  try {
    await connectDB(); // ✅ ensure the DB is connected

    const categoryDoc = await Category.findOne({
      name: { $regex: /^Premium$/i },
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

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
