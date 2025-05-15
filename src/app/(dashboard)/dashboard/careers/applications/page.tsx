"use client";

import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import toast from "react-hot-toast";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

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

  const columns = [
    {
      title: "Job Title",
      dataIndex: "jobId",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (job: any) => job?.title || "N/A",
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
      title: "Cover Letter",
      dataIndex: "coverLetter",
      render: (text: string) =>
        text ? (
          <span className="line-clamp-2">{text}</span>
        ) : (
          <Tag color="red">None</Tag>
        ),
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
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
    </div>
  );
};

export default JobApplicationsPage;
