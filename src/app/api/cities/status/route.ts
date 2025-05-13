import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import City from "@/models/city.model";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, topLocation } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "City ID is required" },
        { status: 400 }
      );
    }

    const updatedCity = await City.findByIdAndUpdate(
      id,
      {
        topLocation,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("stateId");

    if (!updatedCity) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCity,
      message: "City status updated successfully",
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
