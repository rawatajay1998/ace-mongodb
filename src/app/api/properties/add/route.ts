import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";
import Property from "@/models/property.model";
import connectDB from "@/lib/db";
import { Readable } from "stream";
import { generateSlug } from "@/utls/slugify";

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const formData = await req.formData();

  const uploadToCloudinary = async (field: string): Promise<string> => {
    const value = formData.get(field);

    if (!value || typeof value === "string") {
      throw new Error(`${field} is missing or not a file`);
    }

    const buffer = Buffer.from(await value.arrayBuffer());
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

  try {
    const thumbnailUrl = await uploadToCloudinary("thumbnailImage");
    const bannerUrl = await uploadToCloudinary("bannerImage");
    const mobileBannerUrl = await uploadToCloudinary("mobileBannerImage");

    const projectName = formData.get("projectName")?.toString() || "property";

    const newProperty = new Property({
      projectName,
      slug: generateSlug(projectName),
      propertyType: formData.get("propertyType"),
      propertyStatus: formData.get("propertyStatus"),
      city: formData.get("city"),
      area: formData.get("area"),
      areaSize: Number(formData.get("areaSize")),
      description: formData.get("description"),
      locality: formData.get("locality"),
      bathrooms: Number(formData.get("bathrooms")),
      beds: Number(formData.get("beds")),
      propertyPrice: Number(formData.get("propertyPrice")),
      thumbnailImage: thumbnailUrl,
      bannerImage: bannerUrl,
      mobileBannerImage: mobileBannerUrl,
      createdBy: user.id,
      postedBy: user.id,
      status: "pending", // optional: default status
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
