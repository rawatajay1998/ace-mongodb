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

  const uploadMultipleToCloudinary = async (
    field: string
  ): Promise<string[]> => {
    const files: FormDataEntryValue[] = [];
    let index = 0;
    while (formData.has(`${field}[${index}]`)) {
      files.push(formData.get(`${field}[${index}]`)!);
      index++;
    }
    return await Promise.all(files.map((file) => uploadToCloudinary(file)));
  };

  const slug = formData.get("slug")?.toString();
  if (!slug)
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });

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

    const parseObjectIdArray = (key: string): mongoose.Types.ObjectId[] => {
      const raw = formData.getAll(key);
      if (!raw || raw.length === 0) return [];

      // If single value and looks like a JSON array
      if (raw.length === 1 && typeof raw[0] === "string") {
        try {
          const parsed = JSON.parse(raw[0]);
          if (Array.isArray(parsed)) {
            return parsed.map((id) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid ObjectId: ${id}`);
              }
              return new mongoose.Types.ObjectId(id);
            });
          }
        } catch {
          // Not a JSON array — treat as plain string
        }
      }

      // Treat as multiple values (or one raw)
      return raw.map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id.toString())) {
          throw new Error(`Invalid ObjectId: ${id}`);
        }
        return new mongoose.Types.ObjectId(id.toString());
      });
    };

    const parseStringArray = (key: string): string[] => {
      const raw = formData.getAll(key);
      if (!raw || raw.length === 0) return [];

      // Try to parse single stringified JSON array
      if (raw.length === 1 && typeof raw[0] === "string") {
        try {
          const parsed = JSON.parse(raw[0]);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => item.toString());
          }
        } catch {
          // Not a JSON array – fall through
        }
      }

      // Return as string array
      return raw.map((v) => v.toString());
    };

    // Parse FAQs from form data
    const faqsString = formData.get("faqs")?.toString();
    const faqs = faqsString ? JSON.parse(faqsString) : [];

    const newProperty = new Property({
      projectName: formData.get("projectName")?.toString() || "property",
      slug,
      propertyType: parseObjectIdArray("propertyType"),
      propertyTypeName: parseStringArray("propertyTypeName"),
      amenities: parseObjectIdArray("amenities"),
      propertyStatus: new mongoose.Types.ObjectId(
        formData.get("propertyStatus")?.toString()
      ),
      propertyStatusName: formData.get("propertyStatusName")?.toString(),
      propertyCategory: new mongoose.Types.ObjectId(
        formData.get("propertyCategory")?.toString()
      ),
      propertySubCategory: new mongoose.Types.ObjectId(
        formData.get("propertySubCategory")?.toString()
      ),
      propertyCategoryName: formData.get("propertyCategoryName")?.toString(),
      propertySubCategoryName: formData
        .get("propertySubCategoryName")
        ?.toString(),
      city: new mongoose.Types.ObjectId(formData.get("city")?.toString()),
      state: new mongoose.Types.ObjectId(formData.get("state")?.toString()),
      area: new mongoose.Types.ObjectId(formData.get("area")?.toString()),
      developer: mongoose.Types.ObjectId.isValid(
        formData.get("developer")?.toString()
      )
        ? new mongoose.Types.ObjectId(formData.get("developer")!.toString())
        : undefined,
      stateName: formData.get("stateName")?.toString(),
      cityName: formData.get("cityName")?.toString(),
      developerName: formData.get("developerName")?.toString(),
      areaName: formData.get("areaName")?.toString(),
      paymentPlan: formData.get("paymentPlan")?.toString(),
      areaSize: formData.get("areaSize")?.toString(),
      unitType: formData.get("unitType")?.toString(),
      propertyPrice: formData.get("propertyPrice")?.toString(),
      thumbnailImage: thumbnailUrl,
      bannerImage: bannerUrl,
      galleryImages: galleryImagesUrl,
      floorPlansImages: floorPlansImagesUrl,
      createdBy: user.id,
      postedBy: user.id,
      status: "pending",
      aboutProperty: formData.get("aboutProperty")?.toString(),
      metaTitle: formData.get("metaTitle")?.toString(),
      metaDescription: formData.get("metaDescription")?.toString(),
      pricingSection: formData.get("pricingSection")?.toString(),
      locationAdvantages: formData.get("locationAdvantages")?.toString(),
      faqs,
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
