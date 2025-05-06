"use client";

import { Table, Input, Button, Space } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function AgentTable() {
  const [data, setData] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});

  const searchInputRefs = useRef<Record<string, InputRef | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString(),
        ...filters,
        ...(sorter.field && sorter.order
          ? {
              sortField: sorter.field,
              sortOrder: sorter.order,
            }
          : {}),
      });

      const res = await fetch(`/api/agents/get?${query}`);
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
      setLoading(false);
    };

    fetchData();
  }, [pagination, filters, sorter]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _filters: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorter: any
  ) => {
    setPagination({
      current: pagination.current!,
      pageSize: pagination.pageSize!,
    });
    if (sorter.order) {
      setSorter({ field: sorter.field, order: sorter.order });
    } else {
      setSorter({});
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getColumnSearchProps = (dataIndex: string): any => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInputRefs.current[dataIndex] = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => {
            confirm();
            setFilters((prev) => ({
              ...prev,
              [dataIndex]: selectedKeys[0] as string,
            }));
          }}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              setFilters((prev) => ({
                ...prev,
                [dataIndex]: selectedKeys[0] as string,
              }));
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              setFilters((prev) => {
                const updated = { ...prev };
                delete updated[dataIndex];
                return updated;
              });
            }}
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
        setTimeout(() => searchInputRefs.current[dataIndex]?.select(), 100);
      }
    },
  });

  const columns: ColumnsType<Agent> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
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
        pageSizeOptions: ["10", "20", "50"],
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
