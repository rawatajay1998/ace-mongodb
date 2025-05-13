// app/agents/agent/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";

interface Agent {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  country?: string;
  description?: string;
  totalProperties?: number;
}

async function getAgent(id: string): Promise<Agent | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/${id}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (!data.success) return null;

    return data.data;
  } catch (err) {
    console.error("Failed to fetch agent:", err);
    return null;
  }
}

export default async function AgentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const agent = await getAgent(params.id);

  if (!agent) return notFound();

  return (
    <section className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-start">
        <Image
          src={agent.image || "/assets/images/dummy-agent-image.png"}
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
            Total Properties Listed: {agent.totalProperties || 0}
          </div>
        </div>
      </div>
    </section>
  );
}
