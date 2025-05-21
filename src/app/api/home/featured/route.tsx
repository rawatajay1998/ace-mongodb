// API Route (/api/properties/feature/route.ts)
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import Area from "@/models/area.model";
import Category from "@/models/category.model";
import "@/models/user.model";

// Map the tab keys to actual property category names in the database
const CATEGORY_MAP: Record<string, string> = {
  offplan: "Off Plan",
  secondary: "Secondary",
  rental: "Rental",
};

// Cache for category IDs (in-memory, resets on server restart)
const normalizeCategoryName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "");
};

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const searchQuery = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const includeCounts = searchParams.get("includeCounts") === "true";

    if (type === "search") {
      if (category === "top-locations") {
        const areas = await Area.find({
          name: { $regex: searchQuery, $options: "i" },
        });
        return NextResponse.json({ areas });
      } else if (category === "high-roi-projects") {
        const properties = await Property.find({
          projectName: { $regex: searchQuery, $options: "i" },
          verified: true,
          highROIProjects: true,
        });
        return NextResponse.json({ properties });
      } else {
        const categoryDocs = await Category.find({
          $expr: {
            $eq: [
              {
                $toLower: {
                  $replaceAll: { input: "$name", find: " ", replacement: "" },
                },
              },
              normalizeCategoryName(category || ""),
            ],
          },
        });

        console.log(categoryDocs);

        if (!categoryDocs.length) {
          return NextResponse.json(
            { message: "Category not found" },
            { status: 404 }
          );
        }

        // 2. Then find properties referencing these categories
        const categoryIds = categoryDocs.map((c) => c._id);
        const properties = await Property.find({
          projectName: { $regex: searchQuery, $options: "i" },
          verified: true,
          propertyCategory: { $in: categoryIds }, // Using reference ID
        }).populate("propertyCategory");

        return NextResponse.json({ properties });
      }
    }

    if (type === "table") {
      if (category === "top-locations") {
        const topLocations = await Area.find({
          featuredOnHomepage: true,
        }).limit(10);

        if (includeCounts) {
          // Add propertyCount to each area
          const topLocationsWithCounts = await Promise.all(
            topLocations.map(async (area) => {
              const propertyCount = await Property.countDocuments({
                area: area._id,
              });
              return {
                ...area.toObject(),
                propertyCount,
              };
            })
          );
          return NextResponse.json({ topLocations: topLocationsWithCounts });
        }

        return NextResponse.json({ topLocations });
      } else if (category === "high-roi-projects") {
        const properties = await Property.find({
          highROIProjects: true,
          featuredOnHomepage: true,
          verified: true,
        })
          .limit(10)
          .populate("postedBy", "name profileImageUrl email");

        return NextResponse.json({ properties });
      } else {
        // For offplan, secondary, rental
        const dbCategory = CATEGORY_MAP[category || ""];
        if (!dbCategory) {
          return NextResponse.json(
            { message: "Invalid category" },
            { status: 400 }
          );
        }

        const properties = await Property.find({
          propertyCategoryName: dbCategory,
          featuredOnHomepage: true,
          verified: true,
        })
          .limit(10)
          .populate("postedBy", "name profileImageUrl email");

        return NextResponse.json({ properties });
      }
    }

    return NextResponse.json(
      { message: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Featured API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { propertyId, areaId, category } = await req.json();

    if (category === "top-locations" && areaId) {
      await Area.findByIdAndUpdate(areaId, { featuredOnHomepage: true });
      return NextResponse.json({ message: "Area featured successfully" });
    }

    if (propertyId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const update: any = { featuredOnHomepage: true };

      if (category === "high-roi-projects") {
        update.highROIProjects = true;
      } else {
        // For regular categories, ensure we don't modify highROIProjects
        update.highROIProjects = false;
      }

      await Property.findByIdAndUpdate(propertyId, update);
      return NextResponse.json({ message: "Property featured successfully" });
    }

    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Feature error:", error);
    return NextResponse.json(
      { message: "Failed to feature item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { propertyId, areaId, category } = await req.json();

    if (category === "top-locations" && areaId) {
      await Area.findByIdAndUpdate(areaId, { featuredOnHomepage: false });
      return NextResponse.json({ message: "Area removed from featured" });
    }

    if (propertyId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const update: any = { featuredOnHomepage: false };

      // if (category === "high-roi-projects") {
      //   update.highROIProjects = false;
      // }

      await Property.findByIdAndUpdate(propertyId, update);
      return NextResponse.json({ message: "Property removed from featured" });
    }

    return NextResponse.json(
      { message: "Invalid parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Remove feature error:", error);
    return NextResponse.json(
      { message: "Failed to remove featured status" },
      { status: 500 }
    );
  }
}
