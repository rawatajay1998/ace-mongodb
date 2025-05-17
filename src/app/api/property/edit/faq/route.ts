// src/app/api/property/edit/faq/route.ts

import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { slug, faqs } = body;

    if (!slug || !Array.isArray(faqs)) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const updated = await Property.findOneAndUpdate(
      { slug },
      { faqs },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, property: updated });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
