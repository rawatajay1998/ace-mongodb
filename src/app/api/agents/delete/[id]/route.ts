import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Agent from "@/models/user.model";
import { verifyToken } from "@/lib/auth";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  // Get token from cookies (assuming cookie name is 'token', adjust if different)
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // verifyToken can be sync or async - adjust accordingly
  const user = await verifyToken(token);

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  const agentToDelete = await Agent.findById(params.id);

  if (!agentToDelete) {
    return NextResponse.json({ message: "Agent not found" }, { status: 404 });
  }

  if (agentToDelete.role === "admin") {
    return NextResponse.json(
      { message: "You cannot delete another admin" },
      { status: 403 }
    );
  }

  await Agent.findByIdAndDelete(params.id);

  return NextResponse.json({ message: "Agent deleted successfully" });
};
