// app/agents/agent/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  coverImage: string;
  slug: string;
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

  return (
    <section className="container mx-auto p-6">
      {/* Agent Details */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-start mb-10">
        <Image
          src={agent.profileImageUrl || "/assets/images/dummy-agent-image.png"}
          alt={agent.name}
          width={200}
          height={200}
          className="rounded-lg object-cover w-48 h-48"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          {agent.country && <p className="text-gray-500">{agent.country}</p>}
          {agent.email && (
            <p className="mt-1 text-sm text-gray-600">Email: {agent.email}</p>
          )}
          {agent.phone && (
            <p className="text-sm text-gray-600">Phone: {agent.phone}</p>
          )}
          {agent.description && (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {agent.description}
            </p>
          )}
          <div className="mt-4 font-medium text-sm text-blue-600">
            Total Properties Listed:{" "}
            {agent.totalProperties || properties.length}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Properties by {agent.name}
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500">No properties listed by this agent.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition"
              >
                <Image
                  src={property.coverImage || "/assets/images/placeholder.jpg"}
                  alt={property.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-48"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {property.location}
                  </p>
                  <div className="mt-2 font-semibold text-blue-600">
                    AED {property.price.toLocaleString()}
                  </div>

                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-sm text-blue-600 mt-3 inline-block hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
