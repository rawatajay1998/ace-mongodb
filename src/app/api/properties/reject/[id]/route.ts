// src/app/api/properties/approve/[id]/route.ts
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { verified: false },
      { new: true }
    );

    if (!updatedProperty) {
      return new Response(JSON.stringify({ message: "Property not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Property approved",
        property: updatedProperty,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error approving property", error }),
      {
        status: 500,
      }
    );
  }
}
