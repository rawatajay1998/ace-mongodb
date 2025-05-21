import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PaymentPlan from "@/models/paymentPlan.model";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();

  const search = req.nextUrl.searchParams.get("search") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("pageSize") || "10"); // pageSize used in frontend
  const skip = (page - 1) * limit;

  // Build query filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchStage: any = {};
  if (search) {
    // Assuming property.projectName field
    matchStage["property.projectName"] = { $regex: search, $options: "i" };
  }

  // If filtering by propertyId (for fetching single plan in frontend)
  const propertyId = req.nextUrl.searchParams.get("propertyId");
  if (propertyId && Types.ObjectId.isValid(propertyId)) {
    matchStage["propertyId"] = new Types.ObjectId(propertyId);
  }

  // Aggregation pipeline to join PaymentPlan with Property data
  const pipeline = [
    {
      $lookup: {
        from: "properties",
        localField: "propertyId",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    { $match: matchStage },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await PaymentPlan.aggregate(pipeline);
  const paymentPlans = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;

  return NextResponse.json({ paymentPlans, total: totalCount });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const { propertyId, steps } = await req.json();

  if (
    !propertyId ||
    !Types.ObjectId.isValid(propertyId) ||
    !Array.isArray(steps) ||
    steps.length !== 3 ||
    !steps.every(
      (s) =>
        typeof s.title === "string" &&
        typeof s.subtitle === "string" &&
        typeof s.percentage === "number"
    )
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Upsert the payment plan
  const existing = await PaymentPlan.findOne({ propertyId });

  if (existing) {
    existing.steps = steps;
    await existing.save();
    return NextResponse.json({ message: "Plan updated" }, { status: 200 });
  }

  await PaymentPlan.create({ propertyId, steps });
  return NextResponse.json({ message: "Plan created" }, { status: 201 });
}

export async function PUT(req: Request) {
  await connectDB();
  const { planId, propertyId, steps } = await req.json();

  if (
    !planId ||
    !propertyId ||
    !Array.isArray(steps) ||
    steps.length !== 3 ||
    !steps.every(
      (s) => typeof s.title === "string" && typeof s.percentage === "number"
    )
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const plan = await PaymentPlan.findById(planId);
  if (!plan) {
    return NextResponse.json(
      { error: "Payment plan not found" },
      { status: 404 }
    );
  }

  plan.propertyId = propertyId; // Optional if you want to update property, or skip if immutable
  plan.steps = steps;
  await plan.save();

  return NextResponse.json(
    { message: "Payment plan updated" },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  const propertyId = req.nextUrl.searchParams.get("propertyId");
  if (!propertyId || !Types.ObjectId.isValid(propertyId)) {
    return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
  }

  await PaymentPlan.findOneAndDelete({ propertyId });
  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 }
  );
}
