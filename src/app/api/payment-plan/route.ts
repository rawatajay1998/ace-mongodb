import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PaymentPlan from "@/models/paymentPlan.model";
import { Types } from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();
  const propertyId = req.nextUrl.searchParams.get("propertyId");
  if (!propertyId || !Types.ObjectId.isValid(propertyId)) {
    return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
  }

  const plan = await PaymentPlan.findOne({ propertyId });
  if (!plan) {
    return NextResponse.json(
      { message: "Not found", steps: [] },
      { status: 200 }
    );
  }

  return NextResponse.json(plan);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { propertyId, steps } = await req.json();

  if (
    !propertyId ||
    !Array.isArray(steps) ||
    steps.length !== 3 ||
    !steps.every(
      (s) => typeof s.title === "string" && typeof s.percentage === "number"
    )
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existing = await PaymentPlan.findOne({ propertyId });
  if (existing) {
    existing.steps = steps;
    await existing.save();
    return NextResponse.json({ message: "Plan updated" }, { status: 200 });
  }

  await PaymentPlan.create({ propertyId, steps });
  return NextResponse.json({ message: "Plan created" }, { status: 201 });
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
