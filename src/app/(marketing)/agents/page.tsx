"use client";

import { Input, Pagination, Switch, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";

const { Search } = Input;

interface Agent {
  _id: string;
  name: string;
  profileImageUrl: string;
  country?: string;
  languages?: string[];
  location?: string;
  truBroker?: boolean;
  qualityLister?: boolean;
  slug: string;
  totalProperties?: number;
  phoneNumber: string;
  email: string;
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
              className="search_agent"
            />
            <div className="row_switch flex items-center gap-2 ml-4">
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
              className={`grid agents_row ${
                viewType === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {agents.map((agent) => (
                <div key={agent._id} className="agent_card">
                  <Image
                    src={
                      agent.profileImageUrl ||
                      "/assets/images/dummy-agent-image.png"
                    }
                    alt={agent.name}
                    height={200}
                    width={200}
                    className={`object-cover ${
                      viewType === "list"
                        ? "w-40 h-40"
                        : "w-full h-full sm:h-60 md:h-full"
                    }`}
                  />
                  <div className="body">
                    <div>
                      <h3 className="text-lg font-bold">{agent.name}</h3>
                      <p className="country pb-2">
                        <strong className="mr-2">Country:</strong>
                        {agent.country || "Not Known"}
                      </p>
                      <p className="total_rpoperties">
                        <strong>{agent.totalProperties} Properties</strong>
                      </p>
                    </div>

                    <Link
                      href={`/agents/${agent.slug}`}
                      className="btn_primary"
                    >
                      View Profile
                    </Link>
                  </div>
                  <div className="contact_btns">
                    <Tooltip title="Email Agent">
                      <a href={`mailto:${agent.email}`}>
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
                        </button>
                      </a>
                    </Tooltip>
                    <Tooltip title="Call Agent">
                      <a href={`tel:${agent.phoneNumber}`}>
                        <button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
                          </svg>
                        </button>
                      </a>
                    </Tooltip>
                    <Tooltip title="Whatsappp">
                      <a
                        href={`https://wa.me/${agent.phoneNumber}?text=${encodeURIComponent(
                          `Hi ${agent.name}, I'm interested in one of your property listings. Could you please share more details?`
                        )}`}
                      >
                        <button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z"
                            ></path>
                          </svg>
                        </button>
                      </a>
                    </Tooltip>
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
