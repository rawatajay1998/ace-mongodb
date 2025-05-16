// app/api/agents/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import Property from "@/models/property.model";

export async function GET(request: Request, { params }) {
  try {
    await connectDB();

    const agentSlug = await params.id;

    // Find agent by slug
    const agent = await User.findOne({ slug: agentSlug }).lean();
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    // Fetch properties listed by this agent
    const properties = await Property.find({ postedBy: agent._id }).lean();

    console.log(properties);

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
