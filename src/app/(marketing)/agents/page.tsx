"use client";

import { Input, Pagination, Switch } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";

const { Search } = Input;

interface Agent {
  _id: string;
  name: string;
  image?: string;
  country?: string;
  languages?: string[];
  location?: string;
  truBroker?: boolean;
  qualityLister?: boolean;
  slug: string;
  totalProperties?: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
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
      <div className="container max-w-7xl p-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Meet Our Agents</h1>

          <div className="flex items-center gap-2">
            <Search
              placeholder="Search by name"
              allowClear
              onSearch={handleSearch}
              loading={loading}
              style={{ width: 250 }}
            />
            <div className="flex items-center gap-2 ml-4">
              <Grid className="w-4 h-4" />
              <Switch
                checked={viewType === "grid"}
                onChange={(checked) => setViewType(checked ? "grid" : "list")}
              />
              <List className="w-4 h-4" />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading agents...</p>
        ) : (
          <>
            <div
              className={`grid ${
                viewType === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className={`flex ${
                    viewType === "list" ? "flex-row" : "flex-col"
                  } bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition`}
                >
                  <Image
                    src={agent.image || "/assets/images/dummy-agent-image.png"}
                    alt={agent.name}
                    height={200}
                    width={200}
                    className={`object-cover ${
                      viewType === "list"
                        ? "w-40 h-40"
                        : "w-full h-52 sm:h-60 md:h-48"
                    }`}
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-bold">{agent.name}</h3>
                      <p className="text-sm text-gray-500">
                        {agent.country || "Not Known"}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-medium text-black">
                          <strong>{agent.totalProperties}</strong>
                        </span>
                        Properties
                      </div>
                      <Link
                        href={`/agents/${agent.slug}`}
                        className="text-blue-600 text-sm font-medium hover:underline btn_primary"
                      >
                        View Profile
                      </Link>
                    </div>
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
