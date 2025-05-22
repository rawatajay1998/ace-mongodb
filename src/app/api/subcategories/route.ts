import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SubCategory from "@/models/subCategory.model";

// GET all subcategories
export async function GET() {
  await connectDB();
  const subCategories = await SubCategory.find();
  return NextResponse.json(subCategories);
}

// POST new subcategory
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    const newSubCategory = await SubCategory.create({
      name,
    });

    return NextResponse.json(newSubCategory);
  } catch (error) {
    console.error("POST /api/subcategories error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

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

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedSubCategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubCategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Subcategory ID is required" },
        { status: 400 }
      );
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Subcategory deleted successfully",
      deletedSubCategory,
    });
  } catch (error) {
    console.error("DELETE /api/subcategories error:", error);
    return NextResponse.json(
      { error: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
