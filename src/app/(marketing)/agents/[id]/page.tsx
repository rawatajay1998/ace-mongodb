// app/agents/agent/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { Tooltip } from "antd";

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
  aboutProperty: string;
  areaSize: string;
  unitType: string;
  thumbnailImage: string;
  projectName: string;
  propertyTypeName: string;
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
  about: string;
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
            <p>{agent.about}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 listing_page_cards">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="card flex bg-white rounded-lg"
                >
                  <div className="badge">Off Plan</div>
                  <div className="w-[250px] h-full relative flex-shrink-0 image">
                    <Image
                      src={property?.thumbnailImage || "/no-image.jpg"}
                      alt={property.projectName}
                      fill
                      className="object-cover rounded-sm"
                    />
                  </div>

                  <div className="flex flex-col justify-between w-full">
                    <div className="header">
                      <div>
                        <h3 className="project_name">{property.projectName}</h3>
                        <p className="flex items-center gap-2 location">
                          <MapPin size={16} />
                          <span>
                            {property.cityName}, {property.areaName}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="body">
                      <div className="property_details">
                        <span>
                          <strong>Unit Type:</strong>
                          {property.unitType}
                        </span>
                        <span>
                          <strong> Area Size</strong>
                          {property.areaSize} sqft
                        </span>
                        <span>
                          <strong>Property Type</strong>
                          {property.propertyTypeName}
                        </span>
                      </div>

                      <div
                        className="property_about"
                        dangerouslySetInnerHTML={{
                          __html: property.aboutProperty,
                        }}
                      ></div>
                    </div>

                    <div className="footer">
                      <div className="contact_btns">
                        <Tooltip title="Email Agent">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.3 2.7H2.7A1.3 1.3 0 0 0 1.3 4v8a1.3 1.3 0 0 0 1.4 1.3h10.6a1.3 1.3 0 0 0 1.4-1.3V4a1.3 1.3 0 0 0-1.4-1.3zm0 2.6L8 8.7 2.7 5.3V4L8 7.3 13.3 4z"></path>
                              <path fill="none" d="M0 0h16v16H0z"></path>
                            </svg>
                            <span> Email</span>
                          </button>
                        </Tooltip>
                        <Tooltip title="Email Agent">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
                            </svg>
                            <span> Phone</span>
                          </button>
                        </Tooltip>
                        <Tooltip title="Email Agent">
                          <button>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z"
                              ></path>
                            </svg>
                            <span> Whatsapp</span>
                          </button>
                        </Tooltip>
                      </div>
                      <button>View Property</button>
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
