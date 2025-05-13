import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Property from "@/models/property.model"; // import your property model

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

    // Filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (phone) filters.phone = { $regex: phone, $options: "i" };

    // Sort
    const sortObj: Record<string, 1 | -1> =
      sortField && ["name"].includes(sortField)
        ? { [sortField]: sortOrder }
        : { createdAt: -1 };

    const skip = (page - 1) * pageSize;

    // Fetch agents
    const [agents, total] = await Promise.all([
      User.find(filters).sort(sortObj).skip(skip).limit(pageSize),
      User.countDocuments(filters),
    ]);

    // Populate totalProperties for each agent
    const agentWithCounts = await Promise.all(
      agents.map(async (agent) => {
        const propertyCount = await Property.countDocuments({
          postedBy: agent._id,
        });

        return {
          ...agent.toObject(),
          totalProperties: propertyCount,
        };
      })
    );

    return NextResponse.json({ success: true, data: agentWithCounts, total });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
