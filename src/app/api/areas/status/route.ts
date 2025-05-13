import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Area from "@/models/area.model";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, topLocation } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Area ID is required" },
        { status: 400 }
      );
    }

    const updatetArea = await Area.findByIdAndUpdate(
      id,
      {
        topLocation,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("cityId");

    if (!updatetArea) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatetArea,
      message: "Area status updated successfully",
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
