import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import City from "@/models/city.model";

export async function GET() {
  try {
    await connectDB();

    const [
      featuredOffplan,
      featuredSecondary,
      feturedRent,
      featuredHighROI,
      rawTopLocations,
    ] = await Promise.all([
      Property.find({
        verified: true,
        propertyCategoryName: { $regex: "^offplan$", $options: "i" },
        featuredOnHomepage: true,
      }).limit(10),

      Property.find({
        verified: true,
        propertyCategoryName: { $regex: "^secondary$", $options: "i" },
        featuredOnHomepage: true,
      }).limit(10),

      Property.find({
        verified: true,
        propertyCategoryName: { $regex: "^rent$", $options: "i" },
        featuredOnHomepage: true,
      }).limit(10),

      Property.find({
        verified: true,
        highROIProjects: true,
        featuredOnHomepage: true,
      }).limit(10),

      City.find({ featuredOnHomepage: true }).limit(10).lean(), // <-- convert to plain object
    ]);

    // Add property count per city
    const topLocations = await Promise.all(
      rawTopLocations.map(async (city) => {
        const propertyCount = await Property.countDocuments({
          cityId: city._id,
          verified: true,
        });

        return {
          ...city,
          propertyCount,
        };
      })
    );

    return NextResponse.json({
      featuredOffplan,
      featuredSecondary,
      feturedRent,
      featuredHighROI,
      topLocations,
    });
  } catch (error) {
    console.error("Homepage Featured Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured content" },
      { status: 500 }
    );
  }
}
