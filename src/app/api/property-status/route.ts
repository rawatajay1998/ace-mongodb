import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PropertyStatus from "@/models/propertyStatus.model";

// GET all statuses
export async function GET() {
  await connectDB();
  const statuses = await PropertyStatus.find();
  return NextResponse.json(statuses);
}

// POST new status
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Property status name is required" },
        { status: 400 }
      );
    }

    const newStatus = await PropertyStatus.create({ name });
    return NextResponse.json(newStatus);
  } catch (error) {
    console.error("POST /api/property-status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT update status
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

    const updated = await PropertyStatus.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Status not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/property-status error:", error);
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
        { error: "Property status ID is required" },
        { status: 400 }
      );
    }

    const deletedStatus = await PropertyStatus.findByIdAndDelete(id);

    if (!deletedStatus) {
      return NextResponse.json(
        { error: "Property status not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Property status deleted successfully",
      deletedStatus,
    });
  } catch (error) {
    console.error("DELETE /api/property-status error:", error);
    return NextResponse.json(
      { error: "Failed to delete property status" },
      { status: 500 }
    );
  }
}
