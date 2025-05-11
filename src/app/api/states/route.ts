import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import State from "@/models/state.model";

export async function GET() {
  await connectDB();
  const states = await State.find();
  return NextResponse.json(states);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name } = await req.json();
    if (!name)
      return NextResponse.json(
        { error: "State name required" },
        { status: 400 }
      );

    const newState = await State.create({ name });
    return NextResponse.json(newState);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name } = await req.json();
    if (!id || !name)
      return NextResponse.json(
        { error: "Missing id or name" },
        { status: 400 }
      );

    const updatedState = await State.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedState)
      return NextResponse.json({ error: "State not found" }, { status: 404 });

    return NextResponse.json(updatedState);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
