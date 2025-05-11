// app/agents/[id]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import AgentCard from "@/components/marketing/AgentCard";

interface IAgentCardProps {
  _id: string;
  name: string;
  profileImage?: string;
  country: string;
  propertiesCount?: number;
}
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/agent/${params.id}`
  );
  const { data } = await res.json();

  return {
    title: `${data.agent.name} | Ace Elite Properties`,
    description:
      data.agent.bio ||
      `Professional real estate agent at Ace Elite Properties`,
    openGraph: {
      images: [data.agent.profileImage || "/default-agent.jpg"],
    },
  };
}

export default async function AgentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/${params.id}`,
    {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch agent data");
  }

  const { data } = await res.json();
  const { agent, properties } = data;

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Agent Profile Section */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex flex-col items-center mb-6">
              <Image
                src={agent.profileImage || "/default-agent.jpg"}
                alt={agent.name}
                width={200}
                height={200}
                className="rounded-full object-cover w-40 h-40"
              />
              <h1 className="text-2xl font-bold mt-4">{agent.name}</h1>
              <p className="text-gray-600">{agent.country}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Contact Info</h3>
                <p>{agent.email}</p>
                {agent.phone && <p>{agent.phone}</p>}
              </div>

              {agent.bio && (
                <div>
                  <h3 className="font-semibold">About</h3>
                  <p>{agent.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6">
            Properties ({properties.length})
          </h2>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((agent: IAgentCardProps) => (
                <AgentCard key={agent._id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">
                No properties listed by this agent yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
