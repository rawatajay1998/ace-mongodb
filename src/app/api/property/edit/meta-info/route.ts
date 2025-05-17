import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { slug, metaTitle, metaDescription, newSlug } = await req.json();

    const property = await Property.findOne({ slug });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    property.metaTitle = metaTitle;
    property.metaDescription = metaDescription;
    property.slug = newSlug || slug;

    await property.save();

    return NextResponse.json({ message: "Meta info updated" }, { status: 200 });
  } catch (error) {
    console.error("[META_INFO_UPDATE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update meta info" },
      { status: 500 }
    );
  }
}
