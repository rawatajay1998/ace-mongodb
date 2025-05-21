import { getUserFromToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    const user = getUserFromToken(token); // { id, role }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing property slug" },
        { status: 400 }
      );
    }

    const property = await Property.findOne({ slug });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const isOwner = property.postedBy.toString() === user.id;
    const verified = property.verified === true;

    // Admin can delete any property
    if (user.role === "admin") {
      await Property.findOneAndDelete({ slug });
      return NextResponse.json({ message: "Property deleted by admin" });
    }

    // Agent can delete only if they own it AND it's not verified
    if (user.role === "agent") {
      if (isOwner && !verified) {
        await Property.findOneAndDelete({ slug });
        return NextResponse.json({ message: "Property deleted by agent" });
      } else {
        return NextResponse.json(
          { error: "You can only delete your own unverified properties" },
          { status: 403 }
        );
      }
    }

    // For any other roles or cases
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
