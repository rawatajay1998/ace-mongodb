import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import Area from "@/models/area.model";
import SubCategory from "@/models/subCategory.model";
import HomeOrder from "@/models/homeListingOrder.model";
import "@/models/user.model";

const CATEGORY_MAP: Record<string, string> = {
  offplan: "Off Plan",
  secondary: "Secondary",
  rental: "Rental",
};

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

    const orderDoc = await HomeOrder.findOne({ tableName: category });
    const orderIds = orderDoc?.order.map((id) => id.toString()) || [];
    const orderMap = new Map(orderIds.map((id, idx) => [id, idx]));

    if (type === "search") {
      if (category === "top-locations") {
        const areas = await Area.find({
          name: { $regex: searchQuery, $options: "i" },
        });
        return NextResponse.json({ areas });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const topLocations = await Area.find({ featuredOnHomepage: true });

        const itemsMap = new Map(
          topLocations.map((a) => [a._id.toString(), a.toObject()])
        );

        const ordered = orderIds.map((id) => itemsMap.get(id)).filter(Boolean);
        const unordered = [...topLocations]
          .filter((a) => !orderMap.has(a._id.toString()))
          .map((a) => a.toObject());

        const result = [...ordered, ...unordered];

        if (includeCounts) {
          const withCounts = await Promise.all(
            result.map(async (area) => {
              const propertyCount = await Property.countDocuments({
                area: area._id,
              });
              return { ...area, propertyCount };
            })
          );
          return NextResponse.json({ topLocations: withCounts });
        }

        return NextResponse.json({ topLocations: result });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      const properties = await Property.find(filter).populate(
        "postedBy",
        "name profileImageUrl email"
      );

      const itemsMap = new Map(
        properties.map((p) => [p._id.toString(), p.toObject()])
      );

      const ordered = orderIds.map((id) => itemsMap.get(id)).filter(Boolean);
      const unordered = [...properties]
        .filter((p) => !orderMap.has(p._id.toString()))
        .map((p) => p.toObject());

      return NextResponse.json({ properties: [...ordered, ...unordered] });
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
    await connectDB();
    const { category, order } = await req.json();

    if (!category || !Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid category or order payload" },
        { status: 400 }
      );
    }

    const idsOnly = order.map((item: { id: string }) => item.id);

    await HomeOrder.findOneAndUpdate(
      { tableName: category },
      { $set: { order: idsOnly } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
