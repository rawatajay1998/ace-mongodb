import PropertyModel from "@/models/property.model";
import connectDB from "@/lib/db";
import { Property } from "@/app/(dashboard)/properties/page";

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  await connectDB();
  const property = await PropertyModel.findOne({ slug }).lean();
  return property as Property | null;
}
