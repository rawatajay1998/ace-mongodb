import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category.model";

// GET all categories
export async function GET() {
  await connectDB();
  const categories = await Category.find();
  return NextResponse.json(categories);
}

// POST new category
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create a new category
    const newCategory = await Category.create({
      name,
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("POST /api/categories error:", error);
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

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "An unknown error occured" },
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
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Category deleted successfully",
      deletedCategory,
    });
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
