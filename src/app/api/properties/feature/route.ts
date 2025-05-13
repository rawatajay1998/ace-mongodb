import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import City from "@/models/city.model";

const MAX_FEATURED = 10;

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "search";

  try {
    if (["offplan", "rent", "secondary"].includes(category.toLowerCase())) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const baseFilter: any = {
        verified: true,
        propertyCategoryName: { $regex: `^${category}$`, $options: "i" },
      };

      if (type === "table") {
        baseFilter.featuredOnHomepage = true;
      }

      if (search) {
        baseFilter.projectName = { $regex: search, $options: "i" };
      }

      const properties = await Property.find(baseFilter).limit(20);
      return NextResponse.json({ properties });
    }

    if (category === "high-roi-projects") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const baseFilter: any = {
        verified: true,
        highROIProjects: true,
        featuredOnHomepage: true,
      };

      if (search) {
        baseFilter.projectName = { $regex: search, $options: "i" };
      }

      const properties = await Property.find(baseFilter).limit(20);
      return NextResponse.json({ properties });
    }

    if (category === "top-locations") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cityQuery: any = {};

      if (type === "search") {
        cityQuery.topLocation = true;
      }

      if (type === "table") {
        cityQuery.featuredOnHomepage = true;
      }

      if (search) {
        cityQuery.name = { $regex: search, $options: "i" };
      }

      const cities = await City.find(cityQuery).limit(20);
      return NextResponse.json({ cities });
    }

    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { propertyId, cityId, category } = await req.json();

  try {
    if (category === "top-locations" && cityId) {
      const city = await City.findById(cityId);
      if (!city)
        return NextResponse.json(
          { message: "City not found" },
          { status: 404 }
        );

      const featuredCount = await City.countDocuments({
        topLocation: true,
        featuredOnHomepage: true,
      });

      if (featuredCount >= MAX_FEATURED) {
        return NextResponse.json(
          { message: "Max featured cities reached" },
          { status: 400 }
        );
      }

      city.featuredOnHomepage = true;
      await city.save();

      return NextResponse.json({ message: "City marked as featured" });
    }

    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (!property)
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        );

      if (category === "high-roi-projects" && !property.highROIProjects) {
        return NextResponse.json(
          { message: "This property is not marked as High ROI" },
          { status: 400 }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = { featuredOnHomepage: true };
      if (category === "high-roi-projects") {
        filter.highROIProjects = true;
      } else {
        filter.propertyCategoryName = {
          $regex: `^${category}$`,
          $options: "i",
        };
      }

      const featuredCount = await Property.countDocuments(filter);

      if (featuredCount >= MAX_FEATURED) {
        return NextResponse.json(
          { message: "Max featured properties reached" },
          { status: 400 }
        );
      }

      await Property.findByIdAndUpdate(propertyId, {
        featuredOnHomepage: true,
      });

      return NextResponse.json({ message: "Property marked as featured" });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { propertyId, cityId, category } = await req.json();

  const normalize = (str: string) => str?.replace(/\s|-/g, "").toLowerCase();

  try {
    if (category === "top-locations" && cityId) {
      const city = await City.findById(cityId);
      if (!city) {
        return NextResponse.json(
          { message: "City not found" },
          { status: 404 }
        );
      }

      city.featuredOnHomepage = false;
      await city.save();

      return NextResponse.json({ message: "City removed from featured" });
    }

    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (!property) {
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        );
      }

      if (normalize(category) === "highroiprojects") {
        if (!property.highROIProjects || !property.featuredOnHomepage) {
          return NextResponse.json(
            { message: "Property is not a featured High ROI project" },
            { status: 400 }
          );
        }
      } else {
        const matchesCategory =
          normalize(property.propertyCategoryName || "") ===
          normalize(category);

        if (!matchesCategory || !property.featuredOnHomepage) {
          return NextResponse.json(
            {
              message:
                "Property does not match the category or is not featured",
            },
            { status: 400 }
          );
        }
      }

      await Property.findByIdAndUpdate(propertyId, {
        featuredOnHomepage: false,
      });

      return NextResponse.json({ message: "Property removed from featured" });
    }

    return NextResponse.json(
      { message: "Invalid DELETE request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}
