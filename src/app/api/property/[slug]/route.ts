import connectDB from "@/lib/db"; // your MongoDB connect function
import Property from "@/models/property.model"; // your Mongoose model
import { NextResponse } from "next/server";
import "@/models/user.model";
import "@/models/amenity.model";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const property = await Property.findOne({ slug: slug })
      .populate("postedBy", "name profileImageUrl slug") // populate only name + profileImage
      .populate("amenities") // assuming these are referenced
      .populate("faqs"); // assuming these are referenced

    console.log(property);

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    console.error("[PROPERTY_GET_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
