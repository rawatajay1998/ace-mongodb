"use client";

import {
  Table,
  Input,
  Button,
  Space,
  Badge,
  Switch,
  message,
  Dropdown,
  MenuProps,
} from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import axios from "axios";
import toast from "react-hot-toast";
import EditMetaModal from "../dashboard/edit-property-forms/EditMetaModal";
import EditFAQsModal from "../dashboard/edit-property-forms/EditingFaqModel";
import EditImagesModal from "../dashboard/edit-property-forms/EditImagesModel";
import EditorModal from "../dashboard/edit-property-forms/EditEditorContent";
import EditDetailsModal from "../dashboard/edit-property-forms/EditPropertyDetails";
import DeletePropertyModal from "../dashboard/edit-property-forms/DeletePorpertyModal";

interface Property {
  _id: string;
  projectName: string;
  city: string;
  status: string;
  price: number;
  slug: string;
  beds: number;
  propertyCategoryName: string;
  propertyTypeName: string;
  propertyStatusName: string;
  verified: string;
  featuredOnHomepage?: boolean;
  highROIProjects?: boolean;
  exclusiveListing?: boolean;
}

interface PropertyTableProps {
  fetchUrl: string;
  showApproveButton?: boolean;
  onAction?: (propertyId: string) => Promise<void>;
  actionButtonText?: string;
  myPropertiesView?: boolean;
}

interface FetchParams {
  pagination: {
    current: number;
    pageSize: number;
  };
  filters: {
    [key: string]: string | number;
  };
}

export default function PropertyTable({
  fetchUrl,
  onAction,
  actionButtonText,
  myPropertiesView,
}: PropertyTableProps) {
  const [data, setData] = useState<Property[]>([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<{ [key: string]: string | number }>(
    {}
  );
  const [searchTexts, setSearchTexts] = useState<{ [key: string]: string }>({});
  const searchInputs = useRef<{ [key: string]: InputRef | null }>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [openModal, setOpenModal] = useState<
    null | "images" | "faqs" | "meta" | "editor" | "details"
  >(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleOpenModal = (
    type: typeof openModal,
    propertyId: string,
    propertySlug?: string
  ) => {
    setSelectedPropertyId(propertyId);
    if (type === "meta" && propertySlug) {
      setSelectedSlug(propertySlug);
    }
    setOpenModal(type);
  };

  // get user
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include", // important for cookies
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  console.log(user);

  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);
      const query = new URLSearchParams({
        page: params.pagination.current.toString(),
        pageSize: params.pagination.pageSize.toString(),
        ...params.filters,
      });

      try {
        const res = await fetch(`${fetchUrl}?${query}`);
        const json = await res.json();
        setData(json.data);
        setTotal(json.total);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl]
  );

  useEffect(() => {
    fetchData({ pagination, filters });
  }, [fetchData, filters, pagination]);

  const handleTableChange = (pag: TablePaginationConfig) => {
    setPagination({
      current: pag.current || 1,
      pageSize: pag.pageSize || 10,
    });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setFilters((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] || "" }));
  };

  const handleReset = (clearFilters: () => void, dataIndex: string) => {
    clearFilters();
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[dataIndex];
      return updated;
    });
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: "" }));
  };

  const handleApprove = async (propertyId: string) => {
    if (onAction) {
      try {
        await onAction(propertyId);
        fetchData({ pagination, filters });
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleOpenDelete = (slug: string) => {
    setSelectedSlug(slug);
    setDeleteModalVisible(true);
  };

  const handleCloseDelete = () => {
    setSelectedSlug("");
    setDeleteModalVisible(false);
  };

  const updateStatus = async (
    id: string,
    field: "highROIProjects" | "featuredOnHomepage",
    value: boolean
  ) => {
    try {
      await axios.put("/api/properties/high-roi", {
        id,
        [field]: value,
      });
      message.success(`Property ${field} updated`);
      fetchData({ pagination, filters });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateExclusiveListingStatus = async (
    id: string,
    field: "exclusiveListing",
    value: boolean
  ) => {
    try {
      await axios.put("/api/properties/exclusive", {
        id,
        [field]: value,
      });
      message.success(`Property ${field} updated`);
      fetchData({ pagination, filters });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getColumnSearchProps = (dataIndex: string) => {
    if (!searchInputs.current[dataIndex]) {
      searchInputs.current[dataIndex] = null;
    }
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              searchInputs.current[dataIndex] = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={searchTexts[dataIndex] || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKeys(value ? [value] : []);
              setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
            }}
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters!, dataIndex)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => {
            searchInputs.current[dataIndex]?.select?.();
          }, 100);
        }
      },
    };
  };

  const columns: ColumnsType<Property> = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      ...getColumnSearchProps("projectName"),
    },
    {
      title: "City",
      dataIndex: "cityName",
      ...getColumnSearchProps("cityName"),
    },
    {
      title: "Category",
      dataIndex: "propertyCategoryName",
      ...getColumnSearchProps("propertyCategoryName"),
    },
    {
      title: "Property Type",
      dataIndex: "propertyTypeName",
      ...getColumnSearchProps("propertyTypeName"),
    },
    {
      title: "Property Status",
      dataIndex: "propertyStatusName",
      ...getColumnSearchProps("propertyStatusName"),
    },
    {
      title: "Status",
      dataIndex: "verified",
      render: (verified: boolean) => (
        <Badge
          status={verified ? "success" : "warning"}
          text={verified ? "Approved" : "Pending"}
        />
      ),
    },
    ...(user?.role !== "agent"
      ? [
          {
            title: "High ROI",
            key: "highROIProjects",
            render: (_, record) => (
              <Switch
                checked={record.highROIProjects}
                onChange={(checked) =>
                  updateStatus(record._id, "highROIProjects", checked)
                }
              />
            ),
          },
          {
            title: "Exclusive Listing",
            key: "exclusiveListing",
            render: (_, record) => (
              <Switch
                checked={record.exclusiveListing}
                onChange={(checked) =>
                  updateExclusiveListingStatus(
                    record._id,
                    "exclusiveListing",
                    checked
                  )
                }
              />
            ),
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menuItems: MenuProps["items"] = [
          {
            key: "images",
            label: "Edit Images",
            onClick: () => {
              setSelectedSlug(record.slug);
              handleOpenModal("images", record._id);
            },
          },
          {
            key: "faqs",
            label: "Edit FAQs",
            onClick: () => {
              setSelectedSlug(record.slug);
              handleOpenModal("faqs", record._id);
            },
          },
          {
            key: "meta",
            label: "Edit Meta Info",
            onClick: () => handleOpenModal("meta", record._id, record.slug),
          },
          {
            key: "editor",
            label: "Edit Editor Content",
            onClick: () => {
              setSelectedSlug(record.slug);
              handleOpenModal("editor", record._id);
            },
          },
          {
            key: "details",
            label: "Edit Basic Details",
            onClick: () => {
              setSelectedSlug(record.slug);
              handleOpenModal("details", record._id);
            },
          },
        ];

        return (
          <Space>
            {onAction && (
              <Button onClick={() => handleApprove(record._id)} type="primary">
                {actionButtonText}
              </Button>
            )}
            {myPropertiesView && (
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => handleOpenDelete(record.slug)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        loading={loading}
        onChange={handleTableChange}
      />

      <EditImagesModal
        visible={openModal === "images" && !!selectedSlug}
        onClose={() => {
          setOpenModal(null);
          setSelectedSlug(null);
        }}
        slug={selectedSlug || ""}
        onSuccess={() => fetchData({ pagination, filters })}
      />
      <EditFAQsModal
        visible={openModal === "faqs" && !!selectedSlug}
        onClose={() => {
          setOpenModal(null);
          setSelectedSlug(null);
        }}
        slug={selectedSlug || ""}
        onSuccess={() => fetchData({ pagination, filters })}
      />
      <EditMetaModal
        visible={openModal === "meta" && !!selectedSlug}
        onClose={() => {
          setOpenModal(null);
          setSelectedSlug(null);
        }}
        slug={selectedSlug || ""}
        onSuccess={() => fetchData({ pagination, filters })}
      />

      <EditorModal
        visible={openModal === "editor" && !!selectedSlug}
        onClose={() => {
          setOpenModal(null);
          setSelectedSlug(null);
        }}
        slug={selectedSlug || ""}
        onSuccess={() => fetchData({ pagination, filters })}
      />

      <EditDetailsModal
        visible={openModal === "details" && !!selectedSlug}
        onClose={() => {
          setOpenModal(null);
          setSelectedSlug(null);
        }}
        slug={selectedSlug || ""}
        onSuccess={() => fetchData({ pagination, filters })}
      />

      <DeletePropertyModal
        visible={deleteModalVisible}
        onClose={handleCloseDelete}
        slug={selectedSlug}
        onSuccess={() => fetchData({ pagination, filters })}
      />
    </>
  );
}
