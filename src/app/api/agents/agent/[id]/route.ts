// app/api/agents/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Property from "@/models/property.model";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const agentId = await params.id;

    // Fetch agent details
    const agent = await User.findById(agentId).lean();
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Fetch properties listed by this agent
    const properties = await Property.find({ agent: agentId }).lean();

    return NextResponse.json({
      success: true,
      data: {
        agent,
        properties,
      },
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
