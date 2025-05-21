// app/api/agent/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { getUserFromToken } from "@/lib/auth";
import "@/models/category.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = await getUserFromToken(token);

    // if (!user || user.role !== "agent") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { postedBy: user.id };
    const allowedFilters = ["projectName", "city", "status", "price", "beds"];

    allowedFilters.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = { $regex: value, $options: "i" };
      }
    });

    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "ascend" ? 1 : -1;

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Property.find(filters)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .populate("propertyCategory"),
      Property.countDocuments(filters),
    ]);

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("Agent property fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent properties" },
      { status: 500 }
    );
  }
}
