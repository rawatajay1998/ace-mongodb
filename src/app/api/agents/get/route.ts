import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import userModel from "@/models/user.model";

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
    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (email) filters.email = { $regex: email, $options: "i" };
    if (phone) filters.phone = { $regex: phone, $options: "i" };

    // Sort object
    const sortObj: Record<string, 1 | -1> =
      sortField && ["name"].includes(sortField)
        ? { [sortField]: sortOrder }
        : { createdAt: -1 };

    const skip = (page - 1) * pageSize;

    const [agents, total] = await Promise.all([
      userModel.find(filters).sort(sortObj).skip(skip).limit(pageSize),
      userModel.countDocuments(filters),
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
