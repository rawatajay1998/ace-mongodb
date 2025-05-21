// File: /app/api/admin/properties/status/route.ts (or .js if you're using JS)
import { NextRequest, NextResponse } from "next/server";
import Property from "@/models/property.model"; // Adjust path
import dbConnect from "@/lib/db"; // Your DB connection util

export async function PUT(req: NextRequest) {
  await dbConnect();

  const { id, exclusiveListing } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePayload: any = {};
  if (typeof exclusiveListing === "boolean")
    updatePayload.exclusiveListing = exclusiveListing;

  const updatedProperty = await Property.findByIdAndUpdate(id, updatePayload, {
    new: true,
  });

  if (!updatedProperty) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Updated successfully",
    data: updatedProperty,
  });
}
