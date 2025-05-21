import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/contact.model";

export async function GET(req: NextRequest) {
  // Get query parameters from the URL using .get()
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(
    req.nextUrl.searchParams.get("pageSize") || "10",
    10
  ); // Convert to integer with fallback
  const searchName = req.nextUrl.searchParams.get("searchName") || "";
  const searchEmail = req.nextUrl.searchParams.get("searchEmail") || "";

  try {
    await connectDB(); // Connect to the database

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};

    if (searchName) {
      filters.name = { $regex: searchName, $options: "i" }; // Case-insensitive search
    }

    if (searchEmail) {
      filters.email = { $regex: searchEmail, $options: "i" }; // Case-insensitive search
    }

    // Fetch data with pagination
    const totalEnquiries = await Contact.countDocuments(filters);
    const enquiries = await Contact.find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 }); // Sort by creation date (most recent first)

    // Respond with paginated data
    return NextResponse.json({
      data: enquiries,
      total: totalEnquiries,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      email,
      phone,
      role,
      message,
      source = "contact-page", // fallback if not provided
      propertyName = null, // optional
    } = body;

    const newContact = await Contact.create({
      name,
      email,
      phone,
      role,
      message,
      source,
      propertyName,
    });

    return NextResponse.json(
      { message: "Enquiry submitted successfully!", contact: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit enquiry." },
      { status: 500 }
    );
  }
}
