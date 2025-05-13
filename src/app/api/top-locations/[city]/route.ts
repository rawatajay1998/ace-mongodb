import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import City from "@/models/city.model";

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  try {
    await connectDB();

    // Check if city is marked as high ROI
    const city = await City.findOne({
      name: { $regex: new RegExp(params.city, "i") },
      topLocation: true,
    });

    if (!city) {
      return NextResponse.json(
        { success: false, message: "No high ROI properties in this location" },
        { status: 404 }
      );
    }

    // Rest of your property search logic...
    const { searchParams } = new URL(request.url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const queryParams = Object.fromEntries(searchParams.entries());

    // ... (keep your existing property search implementation)
  } catch (error) {
    console.error("[HIGH_ROI_API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Invalid request or server error" },
      { status: 500 }
    );
  }
}
