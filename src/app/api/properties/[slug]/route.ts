import { NextRequest, NextResponse } from "next/server";
import connnectDB from "@/lib/db";
import Property from "@/models/property.model";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  location: z.string(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connnectDB();
  const { slug } = await params;
  const body = await req.json();

  const result = propertySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const property = await Property.findOneAndUpdate({ slug }, body, {
      new: true,
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connnectDB();
  const { slug } = await params;

  try {
    const property = await Property.findOne({ slug });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ property });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
