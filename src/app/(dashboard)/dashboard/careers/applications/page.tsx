"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import toast from "react-hot-toast";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/careers/applications");
      const data = await res.json();
      setApplications(data.data);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const showDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch("/api/careers/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Failed to delete application.");
      }

      toast.success("Application deleted successfully");
      setIsModalVisible(false);
      setDeleteId(null);
      fetchApplications();
    } catch (err) {
      toast.error(err?.message || "Error deleting application.");
      setIsModalVisible(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "Job Title",
      dataIndex: "jobId",
      render: (job) => job?.title || "N/A",
    },
    {
      title: "Applicant Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Resume",
      dataIndex: "resumeUrl",
      render: (url: string) =>
        url ? (
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download CV
          </a>
        ) : (
          <Tag color="red">None</Tag>
        ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id: string) => (
        <Button type="primary" danger onClick={() => showDeleteConfirm(id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-3xl font-bold mb-6 main_title">Job Applications</h2>
      <Table
        dataSource={applications}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p className="text-white">
          Are you sure you want to delete this application?
        </p>
      </Modal>
    </div>
  );
};

export default JobApplicationsPage;
