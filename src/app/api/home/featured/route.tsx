import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import Area from "@/models/area.model";
import SubCategory from "@/models/subCategory.model";
import "@/models/user.model";

const CATEGORY_MAP: Record<string, string> = {
  offplan: "Off Plan",
  secondary: "Secondary",
  rental: "Rental",
};

const normalizeCategoryName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, "");
};

// In-memory store for order — for persistence, use a DB or Redis
const featuredOrderStore: Record<string, { id: string; order: number }[]> = {};

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const searchQuery = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const includeCounts = searchParams.get("includeCounts") === "true";

    const orderList = featuredOrderStore[category || ""] || [];
    const orderMap = new Map(orderList.map((o) => [o.id, o.order]));

    if (type === "search") {
      if (category === "top-locations") {
        const areas = await Area.find({
          name: { $regex: searchQuery, $options: "i" },
        });
        return NextResponse.json({ areas });
      }

      const query: any = {
        projectName: { $regex: searchQuery, $options: "i" },
        verified: true,
      };

      if (category === "exclusive-projects") {
        query.exclusiveListing = true;
      } else if (category === "high-roi-projects") {
        query.highROIProjects = true;
      } else {
        const categoryDocs = await SubCategory.find({
          $expr: {
            $eq: [
              {
                $toLower: {
                  $replaceAll: {
                    input: "$name",
                    find: " ",
                    replacement: "",
                  },
                },
              },
              normalizeCategoryName(category || ""),
            ],
          },
        });

        if (!categoryDocs.length) {
          return NextResponse.json(
            { message: "Category not found" },
            { status: 404 }
          );
        }

        query.propertySubCategory = { $in: categoryDocs.map((c) => c._id) };
      }

      const properties = await Property.find(query).populate(
        "propertySubCategory"
      );
      return NextResponse.json({ properties });
    }

    if (type === "table") {
      if (category === "top-locations") {
        let topLocations = await Area.find({ featuredOnHomepage: true });

        topLocations = topLocations
          .map((a) => ({
            ...a.toObject(),
            order: orderMap.get(a._id.toString()) ?? 9999,
          }))
          .sort((a, b) => a.order - b.order);

        if (includeCounts) {
          const topWithCounts = await Promise.all(
            topLocations.map(async (area) => {
              const propertyCount = await Property.countDocuments({
                area: area._id,
              });
              return { ...area, propertyCount };
            })
          );
          return NextResponse.json({ topLocations: topWithCounts });
        }

        return NextResponse.json({ topLocations });
      }

      const filter: any = {
        verified: true,
        featuredOnHomepage: true,
      };

      if (category === "exclusive-projects") {
        filter.exclusiveListing = true;
      } else if (category === "high-roi-projects") {
        filter.highROIProjects = true;
      } else {
        const dbCategory = CATEGORY_MAP[category || ""];
        if (!dbCategory) {
          return NextResponse.json(
            { message: "Invalid category" },
            { status: 400 }
          );
        }
        filter.propertySubCategoryName = dbCategory;
      }

      let properties = await Property.find(filter).populate(
        "postedBy",
        "name profileImageUrl email"
      );

      properties = properties
        .map((p) => ({
          ...p.toObject(),
          order: orderMap.get(p._id.toString()) ?? 9999,
        }))
        .sort((a, b) => a.order - b.order);

      return NextResponse.json({ properties });
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
      const update: any = { featuredOnHomepage: true };
      if (category === "high-roi-projects") {
        update.highROIProjects = true;
      } else if (category === "exclusive-projects") {
        update.exclusiveListing = true;
      } else {
        update.highROIProjects = false;
        update.exclusiveListing = false;
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

export async function PUT(req: Request) {
  try {
    const { category, order } = await req.json();

    if (!category || !Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid category or order payload" },
        { status: 400 }
      );
    }

    featuredOrderStore[category] = order;
    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
