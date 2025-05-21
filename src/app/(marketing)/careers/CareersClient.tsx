"use client";

import { Card, Tag, Typography, Space } from "antd";
import ApplyJobModal from "./ApplyJobModal";

const { Text, Title } = Typography;

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  experience?: string;
}

const CareersClient = ({ jobs }: { jobs: Job[] }) => {
  return (
    <section className="careers_page">
      <div className=" container">
        <Title level={2}>Available Job Positions</Title>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <Card
              key={job._id}
              title={<Text strong>{job.title}</Text>}
              className="shadow-lg rounded-lg job_card"
              extra={
                <Tag color="green" style={{ marginRight: 0 }}>
                  {job.type}
                </Tag>
              }
            >
              <Space direction="vertical" size="small">
                <Tag color="geekblue">{job.location}</Tag>
                <Text>{job.salary || "Salary not specified"}</Text>
                <Text type="secondary">{job.description.slice(0, 80)}...</Text>
                <ApplyJobModal job={job} />
              </Space>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersClient;
