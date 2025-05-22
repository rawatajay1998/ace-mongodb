// app/api/property/edit/details/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

export async function PUT(req: Request) {
  await connectDB();

  const body = await req.json();
  const {
    slug,
    propertyStatus,
    propertyType,
    propertyCategory,
    propertySubCategory,
    propertyTypeName,
    propertyCategoryName,
    propertySubCategoryName,
    propertyStatusName,
    cityName,
    stateName,
    areaName,
    state,
    city,
    area,
    developer,
    paymentPlan,
    unitType,
    areaSize,
    propertyPrice,
  } = body;

  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    const updated = await Property.findOneAndUpdate(
      { slug },
      {
        propertyStatus,
        propertyType,
        propertyCategory,
        propertySubCategory,
        state,
        city,
        area,
        developer,
        paymentPlan,
        unitType,
        areaSize,
        propertyTypeName,
        propertyCategoryName,
        propertyStatusName,
        propertySubCategoryName,
        cityName,
        stateName,
        areaName,
        propertyPrice,
      },
      { new: true }
    );

    console.log(updated);

    if (!updated)
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Updated successfully",
      property: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
