/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyCard from "@/components/marketing/PropertyCard";
import db from "@/lib/db";
import Property from "@/models/property.model";
import { Metadata } from "next";

interface CityPageProps {
  params: {
    city: string;
  };
}

// Dynamic metadata based on city
export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
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

export default async function CityPage({ params }: CityPageProps) {
  await db();

  const cityName = decodeURIComponent(params.city);

  const properties = await Property.find({
    city: cityName,
    approved: true,
  }).lean();

  if (!properties || properties.length === 0) {
    return (
      <div className="p-6 text-gray-600">
        No properties found in {cityName}.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Properties in {cityName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: any) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}
