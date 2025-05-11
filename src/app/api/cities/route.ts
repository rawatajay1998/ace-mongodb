import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import City from "@/models/city.model";

export async function GET() {
  await connectDB();
  const cities = await City.find().populate("stateId");
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, stateId } = await req.json();
    if (!name || !stateId)
      return NextResponse.json(
        { error: "City name & stateId required" },
        { status: 400 }
      );

    const newCity = await City.create({ name, stateId });
    return NextResponse.json(newCity);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name, stateId } = await req.json();
    if (!id || !name || !stateId)
      return NextResponse.json(
        { error: "Missing id, name or stateId" },
        { status: 400 }
      );

    const updatedCity = await City.findByIdAndUpdate(
      id,
      { name, stateId },
      { new: true }
    );
    if (!updatedCity)
      return NextResponse.json({ error: "City not found" }, { status: 404 });

    return NextResponse.json(updatedCity);
  } catch (err) {
    return NextResponse.json({ error: "Error updating city" }, { status: 500 });
  }
}
