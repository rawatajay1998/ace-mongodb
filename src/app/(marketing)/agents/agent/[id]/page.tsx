import Image from "next/image";
import { notFound } from "next/navigation";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  country?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string;
}

async function getAgentData(
  id: string
): Promise<{ agent: Agent; projects: Project[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch agent");

  return res.json();
}

export default async function AgentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  let data;
  try {
    data = await getAgentData(params.id);
  } catch (e) {
    console.log(e);
    return notFound();
  }

  const { agent, projects } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <Image
          src={agent.image || "/placeholder.jpg"}
          alt={agent.name}
          className="w-48 h-48 object-cover rounded-xl"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
          <p className="text-gray-600">📍 {agent.country || "N/A"}</p>
          <p className="mt-2 text-gray-700">📧 {agent.email}</p>
          <p className="text-gray-700">📞 {agent.phone}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Projects by {agent.name}</h2>

      {projects.length === 0 ? (
        <p>This agent has no projects listed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <Image
                src={project.image || "/placeholder.jpg"}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{project.title}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
