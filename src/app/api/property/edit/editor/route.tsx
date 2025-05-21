import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function PUT(req: NextRequest) {
  await connectDB();

  const { slug, aboutProperty, pricingSection, locationAdvantages } =
    await req.json();

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Missing property slug" },
      { status: 400 }
    );
  }

  const property = await Property.findOne({ slug });
  if (!property) {
    return NextResponse.json(
      { success: false, message: "Property not found" },
      { status: 404 }
    );
  }

  property.aboutProperty = aboutProperty;
  property.pricingSection = pricingSection;
  property.locationAdvantages = locationAdvantages;

  await property.save();

  return NextResponse.json({ success: true });
}
