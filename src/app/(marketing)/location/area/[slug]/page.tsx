/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyCard from "@/components/marketing/PropertyCard";
import db from "@/lib/db";
import Property from "@/models/property.model";
import { Metadata } from "next";
import { IPropertyCardProps } from "@/types/PropertyCardProps";

interface AreaPageProps {
  params: {
    slug: string;
  };
}

// Dynamic metadata based on city
export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const citySlug = decodeURIComponent(params.city);

  const formattedCity = citySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = `Top Properties in ${formattedCity} | Ace Elite Properties`;
  const description = `Explore handpicked off-plan and investment properties in ${formattedCity}. Brought to you by Ace Elite Properties.`;

  const imageUrl =
    "https://aceeliteproperties.com/assets/images/banner-image.webp";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aceeliteproperties.com/location/${citySlug}`,
      siteName: "Ace Elite Properties",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  await db();

  const areaName = params.slug;

  // Decode the URL slug (e.g., "downtown-dubai" => "downtown dubai")
  const decodedSlug = decodeURIComponent(areaName.replace(/-/g, " "));

  console.log(decodedSlug);

  const properties = await Property.find({
    $or: [
      { areaName: { $regex: new RegExp(`^${decodedSlug}$`, "i") } },
      { areaName }, // Also check the original slug format
    ],
    verified: true,
  }).lean();

  console.log(properties);

  if (!properties || properties.length === 0) {
    return (
      <div className="p-6 text-gray-600">
        No properties found in {areaName}.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Properties in {areaName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: IPropertyCardProps) => {
          return (
            <div key={property._id.toString()}>
              <PropertyCard item={property} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
