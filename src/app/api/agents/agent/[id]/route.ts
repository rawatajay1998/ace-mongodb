// app/api/agent/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import User from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agent");

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    const agent = (await User.findById(agentId).lean()) as {
      role: string;
    } | null;
    if (!agent || agent.role !== "agent") {
      return NextResponse.json(
        { error: "Agent not found or unauthorized" },
        { status: 404 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Build filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { postedBy: agentId };
    const allowedFilters = ["projectName", "city", "status", "price", "beds"];

    allowedFilters.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = { $regex: value, $options: "i" };
      }
    });

    // Sorting
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "ascend" ? 1 : -1;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      Property.find(filters)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Property.countDocuments(filters),
    ]);

    return NextResponse.json({ agent, data, total });
  } catch (error) {
    console.error("Agent property fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent properties" },
      { status: 500 }
    );
  }
}
