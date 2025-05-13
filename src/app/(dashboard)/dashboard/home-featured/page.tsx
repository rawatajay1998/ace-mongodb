"use client";
import { useEffect, useState } from "react";
import { Tabs, Select, Table, Button, message, Spin, Empty } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const { TabPane } = Tabs;
const { Option } = Select;

const tabs = [
  { key: "offplan", label: "Offplan" },
  { key: "secondary", label: "Secondary" },
  { key: "rent", label: "Rent" },
  { key: "high-roi-projects", label: "High ROI Projects" },
  { key: "top-locations", label: "Top Locations (Homepage)" },
];

export default function FeaturedProperties() {
  const [activeTabKey, setActiveTabKey] = useState("offplan");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [featuredMap, setFeaturedMap] = useState<Record<string, any[]>>({});
  const [maxReached, setMaxReached] = useState(false);

  useEffect(() => {
    fetchFeaturedItems(activeTabKey);
    setSearchResults([]);
    setSelectedId(null);
  }, [activeTabKey]);

  const fetchSearchResults = async (query: string) => {
    if (!activeTabKey || maxReached) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/properties/feature`, {
        params: {
          category: activeTabKey,
          search: query,
          type: "search",
        },
      });
      setSearchResults(res.data.properties || res.data.cities || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedItems = async (tabKey: string) => {
    const res = await axios.get(`/api/properties/feature`, {
      params: {
        category: tabKey,
        type: "table",
      },
    });
    const featured = res.data.properties || res.data.cities || [];
    setFeaturedMap((prev) => ({ ...prev, [tabKey]: featured }));
    setMaxReached(featured.length >= 10);
  };

  const handleFeature = async () => {
    if (!selectedId || !activeTabKey) return;

    const alreadyFeatured = featuredMap[activeTabKey]?.some(
      (item) => item._id === selectedId
    );
    if (alreadyFeatured) {
      toast("Already featured in this tab.");
      return;
    }

    try {
      const res = await axios.post("/api/properties/feature", {
        propertyId: activeTabKey === "top-locations" ? null : selectedId,
        cityId: activeTabKey === "top-locations" ? selectedId : null,
        category: activeTabKey,
      });
      toast.success(res.data.message);
      setSelectedId(null);
      setSearchResults([]);
      fetchFeaturedItems(activeTabKey);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await axios.delete("/api/properties/feature", {
        data: {
          propertyId: activeTabKey === "top-locations" ? null : id,
          cityId: activeTabKey === "top-locations" ? id : null,
          category: activeTabKey,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      message.success(res.data.message);
      fetchFeaturedItems(activeTabKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="card">
      <h2 className="font-semibold text-2xl mb-4">Manage Featured</h2>
      <Tabs activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)}>
        {tabs.map(({ key, label }) => {
          const count = featuredMap[key]?.length || 0;
          return (
            <TabPane key={key} tab={`${label} (${count}/10 featured)`}>
              <div className="mb-4 flex gap-4 items-end">
                <Select
                  showSearch
                  placeholder={
                    maxReached
                      ? "Limit reached"
                      : `Search ${key === "top-locations" ? "city" : "project"}`
                  }
                  style={{ width: 400 }}
                  size="large"
                  value={selectedId || undefined}
                  onSearch={fetchSearchResults}
                  onChange={setSelectedId}
                  filterOption={false}
                  notFoundContent={loading ? <Spin size="small" /> : <Empty />}
                  disabled={maxReached}
                >
                  {searchResults.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {key === "top-locations" ? item.name : item.projectName}
                    </Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  onClick={handleFeature}
                  disabled={!selectedId || maxReached}
                >
                  Feature
                </Button>
              </div>

              <h3 className="text-lg font-medium mb-2">Featured List</h3>
              <Table
                dataSource={featuredMap[key] || []}
                rowKey="_id"
                pagination={false}
                columns={[
                  {
                    title: key === "top-locations" ? "City" : "Project",
                    render: (_, record) =>
                      key === "top-locations"
                        ? record.name
                        : record.projectName,
                  },
                  key !== "top-locations" && {
                    title: "Category",
                    render: (_, record) => record.propertyCategoryName,
                  },
                  key !== "top-locations" && {
                    title: "City",
                    render: (_, record) => record.cityName,
                  },
                  {
                    title: "Action",
                    render: (_, record) => (
                      <Button danger onClick={() => handleRemove(record._id)}>
                        Remove
                      </Button>
                    ),
                  },
                ].filter(Boolean)}
              />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
