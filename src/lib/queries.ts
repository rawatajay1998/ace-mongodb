import connectDB from "@/lib/db";
import Category from "@/models/category.model";
import City from "@/models/city.model";
import Property from "@/models/property.model";

export async function getCategoryBySlug(slug: string) {
  await connectDB();
  return Category.findOne({ slug });
}

export async function getCityBySlug(slug: string) {
  await connectDB();
  return City.findOne({ slug });
}

export async function getPropertiesByCategoryAndCity(
  categoryId: string,
  cityId: string
) {
  await connectDB();
  return Property.find({
    category: categoryId,
    city: cityId,
  });
}
