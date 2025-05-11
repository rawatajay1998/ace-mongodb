"use client";

import { Table, Input, Button, Space, Badge } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

interface Property {
  _id: string;
  projectName: string;
  city: string;
  status: string;
  price: number;
  beds: number;
  propertyCategory: Category;
  verified: string;
}

interface PropertyTableProps {
  fetchUrl: string;
  showApproveButton?: boolean;
  onAction?: (propertyId: string) => Promise<void>;
  actionButtonText?: string;
  showEditButton: boolean;
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
  showApproveButton = false,
  onAction,
  actionButtonText,
  showEditButton,
}: PropertyTableProps) {
  const [data, setData] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<{ [key: string]: string | number }>(
    {}
  );
  const [searchTexts, setSearchTexts] = useState<{ [key: string]: string }>({});

  const searchInputs = useRef<{ [key: string]: InputRef | null }>({});

  const router = useRouter();

  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);

      const query = new URLSearchParams({
        page: params.pagination.current.toString(),
        pageSize: params.pagination.pageSize.toString(),
        ...params.filters,
      });

      const res = await fetch(`${fetchUrl}?${query}`);
      const json = await res.json();

      setData(json.data);
      setTotal(json.total);
      setLoading(false);
    },
    [fetchUrl]
  );

  useEffect(() => {
    fetchData({ pagination, filters });
  }, [fetchData, pagination, filters]);

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
        // Refresh the table data after approval
        fetchData({ pagination, filters });
      } catch (error) {
        console.error("Error approving property:", error);
      }
    }
  };

  const handleEdit = (propertyId: string) => {
    // Redirect to the edit page for this property
    router.push(`/dashboard/properties/edit/${propertyId}`);
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
      dataIndex: "city",
      ...getColumnSearchProps("city"),
    },
    {
      title: "Category",
      dataIndex: ["propertyCategory", "name"],
      key: "propertyCategory",
      render: (_, record) => record.propertyCategory?.name || "N/A",
    },
    {
      title: "Price",
      dataIndex: "propertyPrice",
      ...getColumnSearchProps("propertyPrice"),
    },
    {
      title: "Beds",
      dataIndex: "beds",
      ...getColumnSearchProps("beds"),
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
  ];

  // Add Approve button column if showApproveButton is true
  if (showApproveButton) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {showEditButton && (
            <Button onClick={() => handleEdit(record._id)} type="primary">
              Edit
            </Button>
          )}

          {onAction && (
            <Button onClick={() => handleApprove(record._id)} type="primary">
              {actionButtonText}
            </Button>
          )}
        </Space>
      ),
    });
  }

  return (
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
  );
}
