import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Agent from "@/models/user.model";
import Property from "@/models/property.model";
import { verifyToken } from "@/lib/auth";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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

  // Find the admin user to assign properties
  const adminUser = await Agent.findOne({ role: "admin" });
  if (!adminUser) {
    return NextResponse.json(
      { message: "Admin user not found" },
      { status: 500 }
    );
  }

  // Reassign properties from deleted agent to admin
  await Property.updateMany(
    { postedBy: agentToDelete._id },
    { $set: { postedBy: adminUser._id } }
  );

  // Now delete the agent
  await Agent.findByIdAndDelete(agentToDelete._id);

  return NextResponse.json({
    message: "Agent deleted and properties reassigned to admin.",
  });
};
