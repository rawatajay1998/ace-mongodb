"use client";

import { Card, Tag, Typography, Space } from "antd";
import ApplyJobModal from "./ApplyJobModal";

const { Text, Title, Paragraph } = Typography;

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  experience?: string;
  requirements: string[];
}

const CareersClient = ({ jobs }: { jobs: Job[] }) => {
  return (
    <section className="careers_page">
      <div className="container">
        <Title level={2}>Available Job Positions</Title>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  return (
    <Card
      title={<Text strong>{job.title}</Text>}
      className="shadow-lg rounded-lg job_card mb-4"
      extra={
        <Tag color="green" style={{ marginRight: 0 }}>
          {job.type}
        </Tag>
      }
    >
      <Space direction="vertical" size="small">
        <Tag color="geekblue">{job.location}</Tag>
        <div className="flex flex-wrap">
          <strong className="block mr-2">Requirements:</strong>
          {job.requirements.map((item) => {
            return <p key={Math.random()}>{item},</p>;
          })}
        </div>

        <Paragraph>
          <div className="flex flex-wrap">
            <strong className="block mr-2">Description:</strong>
            <p>{job.description}</p>
          </div>
        </Paragraph>
        <ApplyJobModal job={job} />
      </Space>
    </Card>
  );
};

export default CareersClient;
