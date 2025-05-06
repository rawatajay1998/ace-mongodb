"use client";

import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";

interface Property {
  _id: string;
  projectName: string;
  city: string;
  status: string;
  price: number;
  beds: number;
}
interface PropertyTableProps {
  fetchUrl: string;
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

export default function PropertyTable({ fetchUrl }: PropertyTableProps) {
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

  console.log(fetchUrl);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getColumnSearchProps = (dataIndex: string): any => {
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
      title: "Status",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
    },
    {
      title: "Price",
      dataIndex: "price",
      ...getColumnSearchProps("price"),
    },
    {
      title: "Beds",
      dataIndex: "beds",
      ...getColumnSearchProps("beds"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record._id}
      pagination={{
        ...pagination,
        total,
        showSizeChanger: true,
        pageSizeOptions: ["1", "2", "3"],
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
