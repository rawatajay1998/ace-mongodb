"use client";

import { Input, Pagination } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Search } = Input;

interface Agent {
  _id: string;
  name: string;
  image?: string;
  country?: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const fetchAgents = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      name,
    });

    const res = await fetch(`/api/agents/get?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setAgents(data.data);
      setTotal(data.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, name]);

  const handleSearch = (value: string) => {
    setPage(1); // reset to first page
    setName(value);
  };

  return (
    <section className="agents_page">
      <div className="container p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Our Agents</h1>

        <div className="flex justify-center mb-6">
          <Search
            placeholder="Search by name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            loading={loading}
          />
        </div>

        {loading ? (
          <p className="text-center">Loading agents...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="bg-white agent_card rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
                >
                  <Image
                    src={agent.image || "/assets/images/dummy-agent-image.png"}
                    alt={agent.name}
                    height={200}
                    width={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-gray-500">
                      {agent.country || "Unknown Country"}
                    </p>
                    <Link href={`/agents/agent/${agent._id}`}>View</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
