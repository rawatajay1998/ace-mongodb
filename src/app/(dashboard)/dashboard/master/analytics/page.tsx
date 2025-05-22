"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Space, Table } from "antd";
import axios from "axios";
import { TrendingUp, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

const { Option } = Select;

interface Stat {
  _id: string;
  label: string;
  icon: "TrendingUp" | "TrendingDown";
}

export default function ManageSiteStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState<"TrendingUp" | "TrendingDown">("TrendingUp");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    const res = await axios.get("/api/analytics");
    setStats(res.data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenModal = (stat?: Stat) => {
    if (stat) {
      setLabel(stat.label);
      setIcon(stat.icon);
      setEditingId(stat._id);
    } else {
      setLabel("");
      setIcon("TrendingUp");
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!label.trim()) return;

    setLoading(true);
    const payload = { label, icon };

    try {
      if (editingId) {
        await axios.put("/api/analytics", { id: editingId, ...payload });
        toast.success("Stat updated");
      } else {
        await axios.post("/api/analytics", payload);
        toast.success("Stat added");
      }
      fetchStats();
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/analytics", { data: { id } });
      fetchStats();
      toast.success("Stat deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon: Stat["icon"]) =>
        icon === "TrendingUp" ? (
          <TrendingUp size={20} color="green" />
        ) : (
          <TrendingDown size={20} color="red" />
        ),
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Stat) => (
        <Space>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="main_title flex items-center justify-between w-full">
          Manage Site Stats
          <Button type="primary" onClick={() => handleOpenModal()}>
            Add Stat
          </Button>
        </h3>
      </div>

      <Table columns={columns} dataSource={stats} rowKey="_id" />

      <Modal
        title={editingId ? "Edit Stat" : "Add Stat"}
        open={open}
        onOk={handleSubmit}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        okText={editingId ? "Update" : "Add"}
      >
        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Select value={icon} onChange={(value) => setIcon(value)}>
            <Option value="TrendingUp">Trending Up</Option>
            <Option value="TrendingDown">Trending Down</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
