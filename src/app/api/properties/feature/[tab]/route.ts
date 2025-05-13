import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import City from "@/models/city.model";

// Shared helper to resolve query based on tab
const getQueryForTab = async (
  tab: string,
  includeSearch = "",
  featuredOnly = true
) => {
  let query: any = {
    verified: true,
  };

  if (featuredOnly) query.featuredOnHomepage = true;

  if (["offplan", "secondary", "rent"].includes(tab)) {
    const formattedCategory = tab.charAt(0).toUpperCase() + tab.slice(1);
    query.propertyCategoryName = new RegExp(`^${formattedCategory}$`, "i");
  } else if (tab === "high-roi-projects") {
    query.highROIProject = true;
  } else if (tab === "top-locations") {
    const topCities = await City.find({ topLocation: true }).select("name");
    const cityNames = topCities.map((c) => c.name);
    query.cityName = { $in: cityNames };
  } else {
    throw new Error("Invalid tab");
  }

  if (includeSearch) {
    query.projectName = { $regex: includeSearch, $options: "i" };
  }

  return query;
};

// === GET: fetch featured or search ===
export const GET = async (
  req: NextRequest,
  { params }: { params: { tab: string } }
) => {
  await connectDB();

  const { tab } = params;
  const search = req.nextUrl.searchParams.get("search") || "";

  try {
    const query = await getQueryForTab(tab, search, true);
    const properties = await Property.find(query).limit(10);
    return NextResponse.json({ properties });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
};

// === POST: feature a property ===
export const POST = async (
  req: NextRequest,
  { params }: { params: { tab: string } }
) => {
  await connectDB();

  const { tab } = params;
  const { propertyId } = await req.json();

  if (!propertyId) {
    return NextResponse.json(
      { message: "Missing property ID" },
      { status: 400 }
    );
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 }
    );
  }

  try {
    const query = await getQueryForTab(tab, "", true);
    const currentCount = await Property.countDocuments(query);

    if (currentCount >= 10) {
      return NextResponse.json(
        { message: "Maximum 10 featured properties allowed for this tab" },
        { status: 400 }
      );
    }

    property.featuredOnHomepage = true;
    await property.save();

    return NextResponse.json({ message: "Property featured successfully" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
};

// === DELETE: unfeature a property ===
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { tab: string } }
) => {
  await connectDB();

  const { propertyId } = await req.json();

  if (!propertyId) {
    return NextResponse.json(
      { message: "Missing property ID" },
      { status: 400 }
    );
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return NextResponse.json(
      { message: "Property not found" },
      { status: 404 }
    );
  }

  property.featuredOnHomepage = false;
  await property.save();

  return NextResponse.json({ message: "Property removed from featured list" });
};
