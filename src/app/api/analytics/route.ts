import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SiteStat from "@/models/siteStat.model";

export async function GET() {
  await connectDB();
  const stats = await SiteStat.find().sort({ createdAt: -1 });
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { label, icon, url } = await req.json();

  if (!label || !["TrendingUp", "TrendingDown"].includes(icon)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const newStat = await SiteStat.create({ label, icon, url });
  return NextResponse.json(newStat);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { id, label, icon, url } = await req.json();

  if (!id || !label || !["TrendingUp", "TrendingDown"].includes(icon)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await SiteStat.findByIdAndUpdate(
    id,
    { label, icon, url },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await SiteStat.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
