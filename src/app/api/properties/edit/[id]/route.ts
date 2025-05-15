import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";
import { revalidatePath } from "next/cache";

connectDB();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();

    // Convert FormData to a regular object
    const formDataObject: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      // Handle array fields
      if (key.includes("[") && key.includes("]")) {
        const fieldName = key.split("[")[0];
        if (!formDataObject[fieldName]) {
          formDataObject[fieldName] = [];
        }
        formDataObject[fieldName].push(value);
      } else {
        formDataObject[key] = value;
      }
    }

    // Handle file uploads
    const thumbnailImageFile = formData.get("thumbnailImage") as File | null;
    const bannerImageFile = formData.get("bannerImage") as File | null;
    const galleryImagesFiles = formData.getAll("galleryImages") as
      | File[]
      | null;
    const floorPlansImagesFiles = formData.getAll("floorPlansImages") as
      | File[]
      | null;

    // Parse JSON fields
    const amenities = formDataObject.amenities
      ? JSON.parse(formDataObject.amenities)
      : [];
    const faqs = formDataObject.faqs ? JSON.parse(formDataObject.faqs) : [];

    // Prepare update data
    const updateData: Record<string, any> = {
      projectName: formDataObject.projectName,
      propertyType: formDataObject.propertyType,
      propertyTypeName: formDataObject.propertyTypeName,
      propertyStatus: formDataObject.propertyStatus,
      propertyStatusName: formDataObject.propertyStatusName,
      propertyCategory: formDataObject.propertyCategory,
      propertyCategoryName: formDataObject.propertyCategoryName,
      state: formDataObject.state,
      stateName: formDataObject.stateName,
      city: formDataObject.city,
      cityName: formDataObject.cityName,
      area: formDataObject.area,
      areaName: formDataObject.areaName,
      metaTitle: formDataObject.metaTitle,
      metaDescription: formDataObject.metaDescription,
      paymentPlan: formDataObject.paymentPlan,
      unitType: formDataObject.unitType,
      areaSize: parseFloat(formDataObject.areaSize),
      propertyPrice: parseFloat(formDataObject.propertyPrice),
      aboutProperty: formDataObject.aboutProperty,
      locationAdvantages: formDataObject.locationAdvantages,
      pricingSection: formDataObject.pricingSection,
      slug: formDataObject.slug,
      amenities,
      faqs,
    };

    // Handle file uploads if they exist
    if (thumbnailImageFile && thumbnailImageFile.size > 0) {
      // Here you would upload to Cloudinary or your storage service
      // For example:
      // const thumbnailUrl = await uploadToCloudinary(thumbnailImageFile);
      // updateData.thumbnailImage = thumbnailUrl;
    }

    if (bannerImageFile && bannerImageFile.size > 0) {
      // Similar upload for banner image
    }

    if (galleryImagesFiles && galleryImagesFiles.length > 0) {
      // Handle gallery images upload
    }

    if (floorPlansImagesFiles && floorPlansImagesFiles.length > 0) {
      // Handle floor plans upload
    }

    // Update the property in the database
    const updatedProperty = await Property.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    revalidatePath("/dashboard/properties");
    revalidatePath(`/properties/${updatedProperty.slug}`);

    return NextResponse.json({
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
