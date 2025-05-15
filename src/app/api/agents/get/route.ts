import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";
    const phone = searchParams.get("phone") || "";

    const sortField = searchParams.get("sortField") || "";
    const sortOrder = searchParams.get("sortOrder") === "ascend" ? 1 : -1;

    // Filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {
      deleted: false,
      role: { $ne: "admin" },
    };

    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (phone) filters.phone = { $regex: phone, $options: "i" };

    // Sort object
    const sortObj: Record<string, 1 | -1> =
      sortField && ["name"].includes(sortField)
        ? { [sortField]: sortOrder }
        : { createdAt: -1 };

    const skip = (page - 1) * pageSize;

    // Get total count of matching users
    const total = await User.countDocuments(filters);

    // Aggregate pipeline to get users with property counts in one query
    const agents = await User.aggregate([
      { $match: filters },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: pageSize },

      // Lookup properties posted by each user
      {
        $lookup: {
          from: "properties", // collection name in MongoDB (usually plural)
          localField: "_id",
          foreignField: "postedBy",
          as: "properties",
        },
      },

      // Add totalProperties field with the count of properties
      {
        $addFields: {
          totalProperties: { $size: "$properties" },
        },
      },

      // Remove properties array from output to reduce payload size
      {
        $project: {
          properties: 0,
          // Optionally exclude fields like password, tokens, etc. here
        },
      },
    ]);

    return NextResponse.json({ success: true, data: agents, total });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
