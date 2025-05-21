import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PropertyType from "@/models/propertyType.model";

// GET all property types
export async function GET() {
  await connectDB();
  const types = await PropertyType.find();
  return NextResponse.json(types);
}

// POST new property type
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newType = await PropertyType.create({ name });
    return NextResponse.json(newType);
  } catch (err) {
    console.error("POST /api/property-types error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT update property type
export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Missing id or name" },
        { status: 400 }
      );
    }

    const updated = await PropertyType.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/property-types error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Property type ID is required" },
        { status: 400 }
      );
    }

    const deletedType = await PropertyType.findByIdAndDelete(id);

    if (!deletedType) {
      return NextResponse.json(
        { error: "Property type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Property type deleted successfully",
      deletedType,
    });
  } catch (error) {
    console.error("DELETE /api/property-types error:", error);
    return NextResponse.json(
      { error: "Failed to delete property type" },
      { status: 500 }
    );
  }
}
