import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      userId,
      name,
      email,
      country,
      address,
      phoneNumber,
      about,
      profileImageUrl,
      slug,
    } = await req.json();

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check for conflicts (excluding current user)
    const conflicts = await User.findOne({
      $and: [
        {
          _id: { $ne: userId },
        },
        {
          $or: [{ name }, { slug }, { email }, { phoneNumber }],
        },
      ],
    });

    if (conflicts) {
      const conflictFields = [];
      if (conflicts.name === name) conflictFields.push("name");
      if (conflicts.slug === slug) conflictFields.push("slug");
      if (conflicts.email === email) conflictFields.push("email");
      if (conflicts.phoneNumber === phoneNumber)
        conflictFields.push("phone number");

      return NextResponse.json(
        {
          success: false,
          message: `The following fields must be unique and already exist: ${conflictFields.join(", ")}`,
        },
        { status: 409 }
      );
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        country,
        address,
        phoneNumber,
        about,
        profileImageUrl,
        slug,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/agents/update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
