import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Area from "@/models/area.model";

export async function GET() {
  await connectDB();
  const areas = await Area.find().populate("cityId");
  return NextResponse.json(areas);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, cityId } = await req.json();
    if (!name || !cityId)
      return NextResponse.json(
        { error: "Area name & cityId required" },
        { status: 400 }
      );

    const newArea = await Area.create({ name, cityId });
    return NextResponse.json(newArea);
  } catch (err) {
    return NextResponse.json({ error: "Error creating area" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name, cityId } = await req.json();
    if (!id || !name || !cityId)
      return NextResponse.json(
        { error: "Missing id, name or cityId" },
        { status: 400 }
      );

    const updatedArea = await Area.findByIdAndUpdate(
      id,
      { name, cityId },
      { new: true }
    );
    if (!updatedArea)
      return NextResponse.json({ error: "Area not found" }, { status: 404 });

    return NextResponse.json(updatedArea);
  } catch (err) {
    return NextResponse.json({ error: "Error updating area" }, { status: 500 });
  }
}
