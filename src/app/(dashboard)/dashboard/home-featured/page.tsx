"use client";

import { useEffect, useRef, useState } from "react";
import {
  Tabs,
  Select,
  Table,
  Button,
  message,
  Spin,
  Empty,
  TableProps,
} from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import {
  DndProvider,
  useDrag,
  useDrop,
  DropTargetMonitor,
  DragSourceMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { XYCoord } from "dnd-core";
import update from "immutability-helper";

const { TabPane } = Tabs;
const { Option } = Select;

interface Property {
  _id: string;
  projectName: string;
  propertyCategoryName?: string;
  propertySubCategoryName?: string;
  areaName?: string;
  highROIProjects?: boolean;
}

interface Area {
  _id: string;
  name: string;
}

type TabKey =
  | "offplan"
  | "secondary"
  | "rental"
  | "high-roi-projects"
  | "exclusive-projects"
  | "top-locations";

type FeaturedItem = Property | Area;

interface DragItem {
  index: number;
  type: string;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "offplan", label: "New Launch" },
  { key: "secondary", label: "Ready To Move" },
  { key: "rental", label: "Rental" },
  { key: "high-roi-projects", label: "High ROI Projects" },
  { key: "exclusive-projects", label: "Exclusive Projects" },
  { key: "top-locations", label: "Top Locations" },
];

const type = "DraggableRow";

export default function FeaturedProperties() {
  const [activeTabKey, setActiveTabKey] = useState<TabKey>("offplan");
  const [searchResults, setSearchResults] = useState<FeaturedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [featuredMap, setFeaturedMap] = useState<
    Record<TabKey, FeaturedItem[]>
  >({
    offplan: [],
    secondary: [],
    rental: [],
    "high-roi-projects": [],
    "exclusive-projects": [],
    "top-locations": [],
  });
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
      const res = await axios.get("/api/home/featured", {
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

  const fetchFeaturedItems = async (tabKey: TabKey) => {
    try {
      const res = await axios.get("/api/home/featured", {
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
      setMaxReached((featured?.length || 0) >= 10);
    } catch (error) {
      toast.error(error.message);
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

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const updatedList = update(featuredMap[activeTabKey], {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, featuredMap[activeTabKey][dragIndex]],
      ],
    });

    setFeaturedMap((prev) => ({
      ...prev,
      [activeTabKey]: updatedList,
    }));

    saveOrderToBackend(updatedList);
  };

  const saveOrderToBackend = async (orderedItems: FeaturedItem[]) => {
    try {
      const ids = orderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      await axios.put("/api/home/featured", {
        category: activeTabKey,
        order: ids,
      });

      toast.success("Order saved!");
    } catch (error) {
      toast.error(error.message || "Error saving order.");
    }
  };

  const DraggableBodyRow: React.FC<
    React.HTMLAttributes<HTMLTableRowElement> & {
      index: number;
      moveRow: (dragIndex: number, hoverIndex: number) => void;
    }
  > = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef<HTMLTableRowElement>(null);

    const [, drop] = useDrop<DragItem>({
      accept: type,
      hover(item: DragItem, monitor: DropTargetMonitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveRow(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type,
      item: { index },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <tr
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          ...style,
        }}
        className={className}
        {...restProps}
      />
    );
  };

  return (
    <div className="card">
      <h2 className="font-semibold main_title text-2xl mb-4">
        Manage Featured
      </h2>
      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key as TabKey)}
      >
        {tabs.map(({ key, label }) => {
          const featuredItems = featuredMap[key] || [];
          const count = featuredItems.length;
          const isTopLocations = key === "top-locations";
          const isHighROI = key === "high-roi-projects";
          const isExclusive = key === "exclusive-projects";

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
                      {"name" in item ? item.name : item.projectName}
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

              <DndProvider backend={HTML5Backend}>
                <Table
                  dataSource={featuredItems}
                  rowKey="_id"
                  pagination={false}
                  components={{
                    body: {
                      row: DraggableBodyRow,
                    },
                  }}
                  onRow={(_, index) =>
                    ({
                      index: index!,
                      moveRow,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }) as any
                  }
                  columns={
                    [
                      {
                        title: isTopLocations ? "Area" : "Project",
                        dataIndex: isTopLocations ? "name" : "projectName",
                      },
                      !isTopLocations &&
                        !isHighROI && {
                          title: "Category",
                          dataIndex: "propertyCategoryName",
                        },
                      {
                        title: "Subcategory",
                        dataIndex: "propertySubCategoryName",
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
                      isExclusive && {
                        title: "High ROI",
                        render: (_, record: Property) =>
                          record.highROIProjects ? "Yes" : "No",
                      },
                      {
                        title: "Action",
                        render: (_, record: FeaturedItem) => (
                          <Button
                            danger
                            onClick={() => handleRemove(record._id)}
                          >
                            Remove
                          </Button>
                        ),
                      },
                    ].filter(Boolean) as TableProps<FeaturedItem>["columns"]
                  }
                />
              </DndProvider>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
