import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import City from "@/models/city.model";

export async function GET() {
  try {
    await connectDB();
    const topLocations = await City.find({ topLocation: true })
      .populate("stateId")
      .limit(10)
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: topLocations });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
