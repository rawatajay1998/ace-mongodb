import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { category: string } }
) => {
  await connectDB();

  const rawCategory = params.category;

  // Normalize: convert to title-case and remove hyphens/underscores
  const formattedCategory = rawCategory
    .replace(/[-_]/g, " ") // replace hyphens/underscores with space
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const validCategories = ["Offplan", "Rent", "Secondary"];
  if (!validCategories.includes(formattedCategory)) {
    return NextResponse.json({ message: "Invalid category" }, { status: 400 });
  }

  try {
    const properties = await Property.find({
      verified: true,
      featuredOnHomepage: true,
      propertyCategoryName: {
        $regex: `^${formattedCategory}$`,
        $options: "i",
      },
    }).limit(10);

    console.log(properties);

    return NextResponse.json({ properties });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch properties", error },
      { status: 500 }
    );
  }
};
