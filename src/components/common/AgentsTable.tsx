"use client";

import { Table, Input, Button, Space, Popconfirm, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  role: string;
}

export default function AgentTable() {
  const [data, setData] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const searchInputRefs = useRef<Record<string, InputRef | null>>({});

  // Fetch user role on mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setIsAdmin(data.user?.role === "admin");
      } catch (err) {
        console.error("Error fetching user:", err);
        setIsAdmin(false);
      }
    };

    fetchRole();
  }, []);

  // Fetch agents data
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

    try {
      const res = await fetch(`/api/agents/get?${query.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch agents");
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    } catch {
      message.error("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination, filters, sorter]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters,
    sorter
  ) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
    if (sorter.order) {
      setSorter({ field: sorter.field as string, order: sorter.order });
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/agents/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        message.success("Agent deleted");
        fetchData();
      } else {
        const err = await res.json();
        message.error(err.message || "Delete failed");
      }
    } catch {
      message.error("Delete failed due to network error");
    }
  };

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
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Country",
      dataIndex: "country",
      ...getColumnSearchProps("country"),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (_id: string, record: Agent) =>
        isAdmin && record.role !== "admin" ? (
          <Popconfirm
            title="Are you sure to delete this agent?"
            onConfirm={() => handleDelete(_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        ) : null,
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
      }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
}
