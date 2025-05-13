import PropertyCard from "@/components/marketing/PropertyCard";
import db from "@/lib/db";
import Property from "@/models/property.model";
interface CityPageProps {
  params: {
    city: string;
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
