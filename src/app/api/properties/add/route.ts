import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";
import Property from "@/models/property.model";
import connectDB from "@/lib/db";
import { Readable } from "stream";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const formData = await req.formData();

  // upload image files to cloudinary
  const uploadToCloudinary = async (
    file: FormDataEntryValue
  ): Promise<string> => {
    if (!file || typeof file === "string") {
      throw new Error("File is missing or not a file");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "properties" },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("Upload failed"));
          resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    return result.secure_url;
  };

  // upload multiple files to cloudinary
  const uploadMultipleToCloudinary = async (
    field: string
  ): Promise<string[]> => {
    const files: FormDataEntryValue[] = [];
    let index = 0;
    while (formData.has(`${field}[${index}]`)) {
      files.push(formData.get(`${field}[${index}]`)!);
      index++;
    }

    const urls = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );

    return urls;
  };

  const slug = formData.get("slug")?.toString();

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  // Check if slug already exists
  const existingProperty = await Property.findOne({ slug });
  if (existingProperty) {
    return NextResponse.json(
      { error: "Property URL already exists" },
      { status: 409 }
    );
  }

  try {
    const thumbnailUrl = await uploadToCloudinary(
      formData.get("thumbnailImage")!
    );
    const bannerUrl = await uploadToCloudinary(formData.get("bannerImage")!);
    const galleryImagesUrl = await uploadMultipleToCloudinary("galleryImages");
    const floorPlansImagesUrl =
      await uploadMultipleToCloudinary("floorPlansImages");

    const projectName = formData.get("projectName")?.toString() || "property";

    // Parse FAQs from form data
    const faqsString = formData.get("faqs")?.toString();
    const faqs = faqsString ? JSON.parse(faqsString) : [];

    // Validate FAQs structure
    if (faqs && !Array.isArray(faqs)) {
      return NextResponse.json(
        { error: "Invalid FAQs format" },
        { status: 400 }
      );
    }

    const newProperty = new Property({
      projectName,
      slug: formData.get("slug"),
      propertyType: new mongoose.Types.ObjectId(
        formData.get("propertyType")?.toString()
      ),
      propertyTypeName: formData.get("propertyTypeName"),
      propertyStatus: new mongoose.Types.ObjectId(
        formData.get("propertyStatus")?.toString()
      ),
      propertyStatusName: formData.get("propertyStatusName"),
      propertyCategory: new mongoose.Types.ObjectId(
        formData.get("propertyCategory")?.toString()
      ),
      propertySubCategory: new mongoose.Types.ObjectId(
        formData.get("propertySubCategory")?.toString()
      ),
      propertyCategoryName: formData.get("propertyCategoryName"),
      propertySubCategoryName: formData.get("propertySubCategoryName"),

      city: new mongoose.Types.ObjectId(formData.get("city")?.toString()),
      state: new mongoose.Types.ObjectId(formData.get("state")?.toString()),
      area: new mongoose.Types.ObjectId(formData.get("area")?.toString()),
      developer: new mongoose.Types.ObjectId(
        formData.get("developer")?.toString()
      ),
      stateName: formData.get("stateName"),
      cityName: formData.get("cityName"),
      developerName: formData.get("developerName"),
      areaName: formData.get("areaName"),
      paymentPlan: formData.get("paymentPlan"),
      areaSize: String(formData.get("areaSize")),
      unitType: String(formData.get("unitType")),
      propertyPrice: String(formData.get("propertyPrice")),
      thumbnailImage: thumbnailUrl,
      bannerImage: bannerUrl,
      galleryImages: galleryImagesUrl, // Add gallery images to the property
      floorPlansImages: floorPlansImagesUrl,
      createdBy: user.id,
      postedBy: user.id,
      status: "pending",
      aboutProperty: formData.get("aboutProperty"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      pricingSection: formData.get("pricingSection"),
      locationAdvantages: formData.get("locationAdvantages"),
      faqs: faqs,
      amenities: formData.get("amenities")
        ? JSON.parse(formData.get("amenities") as string)
        : [],
    });

    await newProperty.save();

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error("Property save error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
