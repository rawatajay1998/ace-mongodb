// app/agents/agent/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Metadata } from "next";
import { AreaChartIcon, Bed, Mail, Phone, Star } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

// Generate dynamic meta for agent page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agentSlug = decodeURIComponent(params.id);

  const capitalizedName =
    agentSlug.charAt(0).toUpperCase() + agentSlug.slice(1).replace(/-/g, " ");

  const title = `Meet ${capitalizedName} | Real Estate Agent at Ace Elite Properties`;
  const description = `Learn more about ${capitalizedName}, one of our expert real estate agents at Ace Elite Properties. Get in touch for premium property deals.`;

  const imageUrl =
    "https://aceeliteproperties.com/assets/images/banner-image.webp"; // Change to agent banner if you have one

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aceeliteproperties.com/agents/${agentSlug}`,
      siteName: "Ace Elite Properties",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  coverImage: string;
  slug: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  type?: string;
  furnished?: boolean;
  areaName: string;
  cityName: string;
  propertyPrice: string;
}

interface Agent {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profileImageUrl?: string;
  country?: string;
  description?: string;
  totalProperties?: number;
  experience?: number;
  languages?: string[];
  expertise?: string[];
  serviceAreas?: string[];
  propertiesForSale?: number;
  propertiesForRent?: number;
}

async function getAgent(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/${id}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    if (!data.success) return null;

    return data.data;
  } catch (err) {
    console.error("Failed to fetch agent:", err);
    return null;
  }
}

export default async function AgentDetailsPage({ params }) {
  const data = await getAgent(params.id);
  if (!data?.agent) return notFound();

  const agent: Agent = data.agent;
  const properties: Property[] = data.properties;

  console.log(data);

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Agent Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
              <Image
                src={
                  agent.profileImageUrl ||
                  "/assets/images/dummy-agent-image.png"
                }
                alt={agent.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-center">{agent.name}</h1>
            <div className="flex items-center gap-1 mt-2 text-yellow-500">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
              <span className="text-gray-600 ml-1">(24)</span>
            </div>
            <p className="text-gray-500 mt-1">Ace Elite Properties</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                Top Rated
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                Quality Lister
              </span>
              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                Responsive Broker
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3">
            {agent.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="text-blue-600" />
                <a href={`tel:${agent.phone}`} className="hover:text-blue-600">
                  {agent.phone}
                </a>
              </div>
            )}
            {agent.email && (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="text-blue-600" />
                <a
                  href={`mailto:${agent.email}`}
                  className="hover:text-blue-600"
                >
                  {agent.email}
                </a>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">About</h3>
            <div className="space-y-4 text-sm text-gray-700">
              {agent.languages && (
                <div>
                  <span className="font-medium">Language(s):</span>{" "}
                  {agent.languages.join(", ")}
                </div>
              )}
              {agent.expertise && (
                <div>
                  <span className="font-medium">Expertise:</span>{" "}
                  {agent.expertise.join(", ")}
                </div>
              )}
              {agent.serviceAreas && (
                <div>
                  <span className="font-medium">Service Areas:</span>{" "}
                  {agent.serviceAreas.join(", ")}
                </div>
              )}
              <div>
                <span className="font-medium">Properties:</span> For Sale (
                {agent.propertiesForSale || 0}), For Rent (
                {agent.propertiesForRent || 0})
              </div>
              {agent.description && (
                <div>
                  <span className="font-medium">Description:</span>{" "}
                  {agent.description}
                  <button className="text-blue-600 ml-1 hover:underline">
                    Read all
                  </button>
                </div>
              )}
              {agent.experience && (
                <div>
                  <span className="font-medium">Experience:</span>{" "}
                  {agent.experience} {agent.experience === 1 ? "year" : "years"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="flex-1">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Active Properties</h2>
              <div className="flex flex-wrap gap-3">
                <select className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm">
                  <option>All</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <select className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm">
                  <option>Any Type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Townhouse</option>
                </select>
                <select className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm">
                  <option>Price (AED)</option>
                  <option>Low to High</option>
                  <option>High to Low</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Showing 1 - {Math.min(12, properties.length)} of{" "}
              {properties.length} Properties sorted by Popular
            </div>
          </div>

          {/* Property List */}
          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-500">
                No properties listed by this agent.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        property.coverImage || "/assets/images/placeholder.jpg"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
                      {property.type || "Apartment"}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {property.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        AED {property.propertyPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {property.areaName}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed /> {property.bedrooms}
                        </span>
                      )}

                      {property.area && (
                        <span className="flex items-center gap-1">
                          <AreaChartIcon /> {property.area} sqft
                        </span>
                      )}
                    </div>

                    {property.furnished && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Fully Furnished
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Lavish Interior
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          Well Maintained
                        </span>
                      </div>
                    )}

                    <div className="mt-5 flex justify-between items-center">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                      <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
