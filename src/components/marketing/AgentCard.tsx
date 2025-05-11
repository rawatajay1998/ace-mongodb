// components/AgentCard.tsx
import Image from "next/image";
import Link from "next/link";

interface IAgentCardProps {
  agent: {
    _id: string;
    name: string;
    profileImage?: string;
    country: string;
    propertiesCount?: number;
  };
}

export default function AgentCard({ agent }: IAgentCardProps) {
  return (
    <Link href={`/agents/${agent._id}`} passHref>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        {/* Agent Image */}
        <div className="relative h-48 w-full">
          <Image
            src={agent.profileImage || "/default-agent.jpg"}
            alt={agent.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Agent Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
          <p className="text-gray-600 mb-2">{agent.country}</p>

          {agent.propertiesCount !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">Properties:</span>
              <span className="font-medium">{agent.propertiesCount}</span>
            </div>
          )}

          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300">
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}
