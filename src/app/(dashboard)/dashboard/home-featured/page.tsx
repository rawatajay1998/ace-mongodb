// Client Component
"use client";
import { useEffect, useState } from "react";
import { Tabs, Select, Table, Button, message, Spin, Empty } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const { TabPane } = Tabs;
const { Option } = Select;

interface Property {
  _id: string;
  projectName: string;
  propertyCategoryName?: string;
  areaName?: string;
  highROIProjects?: boolean;
}

interface Area {
  _id: string;
  name: string;
}

const tabs = [
  { key: "offplan", label: "Offplan" },
  { key: "secondary", label: "Secondary" },
  { key: "rental", label: "Rental" },
  { key: "high-roi-projects", label: "High ROI Projects" },
  { key: "top-locations", label: "Top Locations" },
];

export default function FeaturedProperties() {
  const [activeTabKey, setActiveTabKey] = useState<string>("offplan");
  const [searchResults, setSearchResults] = useState<(Property | Area)[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [featuredMap, setFeaturedMap] = useState<
    Record<string, (Property | Area)[]>
  >({});
  const [maxReached, setMaxReached] = useState<boolean>(false);

  useEffect(() => {
    fetchFeaturedItems(activeTabKey);
    setSearchResults([]);
    setSelectedId(null);
  }, [activeTabKey]);

  const fetchSearchResults = async (query: string) => {
    if (!activeTabKey || maxReached) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/home/featured`, {
        params: {
          category: activeTabKey,
          search: query,
          type: "search",
        },
      });

      const data = res.data;
      const results =
        activeTabKey === "top-locations" ? data.areas : data.properties;
      setSearchResults(results || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedItems = async (tabKey: string) => {
    try {
      const res = await axios.get(`/api/home/featured`, {
        params: {
          category: tabKey,
          type: "table",
        },
      });

      const featured =
        tabKey === "top-locations"
          ? res.data.topLocations
          : res.data.properties;
      setFeaturedMap((prev) => ({ ...prev, [tabKey]: featured || [] }));
      setMaxReached(featured?.length >= 10);
    } catch (error) {
      toast.error(error);
    }
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
      await axios.post("/api/home/featured", {
        propertyId: activeTabKey === "top-locations" ? null : selectedId,
        areaId: activeTabKey === "top-locations" ? selectedId : null,
        category: activeTabKey,
      });
      toast.success("Featured successfully");
      setSelectedId(null);
      setSearchResults([]);
      fetchFeaturedItems(activeTabKey);
    } catch (error) {
      toast.error(error.response?.data?.message || "Feature failed");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete("/api/home/featured", {
        data: {
          propertyId: activeTabKey === "top-locations" ? null : id,
          areaId: activeTabKey === "top-locations" ? id : null,
          category: activeTabKey,
        },
      });
      message.success("Removed from featured");
      fetchFeaturedItems(activeTabKey);
    } catch (error) {
      message.error(error.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div className="card">
      <h2 className="font-semibold main_title text-2xl mb-4">
        Manage Featured
      </h2>
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        {tabs.map(({ key, label }) => {
          const featuredItems = featuredMap[key] || [];
          const count = featuredItems.length;
          const isTopLocations = key === "top-locations";
          const isHighROI = key === "high-roi-projects";

          return (
            <TabPane key={key} tab={`${label} (${count}/10 featured)`}>
              <div className="mb-4 flex gap-4 items-end">
                <Select
                  showSearch
                  placeholder={
                    maxReached
                      ? "Limit reached"
                      : `Search ${isTopLocations ? "area" : "project"}`
                  }
                  style={{ width: 400 }}
                  size="large"
                  value={selectedId}
                  onSearch={fetchSearchResults}
                  onChange={setSelectedId}
                  filterOption={false}
                  notFoundContent={loading ? <Spin size="small" /> : <Empty />}
                  disabled={maxReached}
                >
                  {searchResults.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {isTopLocations
                        ? (item as Area).name
                        : (item as Property).projectName}
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
                dataSource={featuredItems}
                rowKey="_id"
                pagination={false}
                columns={[
                  {
                    title: isTopLocations ? "Area" : "Project",
                    dataIndex: isTopLocations ? "name" : "projectName",
                  },
                  !isTopLocations &&
                    !isHighROI && {
                      title: "Category",
                      dataIndex: "propertyCategoryName",
                    },
                  !isTopLocations && {
                    title: "Area",
                    dataIndex: "areaName",
                  },
                  isHighROI && {
                    title: "Category",
                    render: (_, record: Property) =>
                      record.propertyCategoryName || "N/A",
                  },
                  isHighROI && {
                    title: "High ROI",
                    render: (_, record: Property) =>
                      record.highROIProjects ? "Yes" : "No",
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
