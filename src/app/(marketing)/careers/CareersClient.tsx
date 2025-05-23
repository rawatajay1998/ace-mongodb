"use client";

import { Card, Tag, Typography, Space, Button } from "antd";
import { useState } from "react";
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

        <div className="grid grid-cols-1 gap-8">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  const isLong = job.description.length > 100;

  console.log(job);

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
          <strong className="block mr-2">Job Requirements:</strong>
          {job.requirements.map((item) => {
            return <p key={Math.random()}>{item},</p>;
          })}
        </div>

        <Paragraph>
          <div className="flex flex-wrap">
            <strong className="block mr-2">Job Requirements:</strong>
            <p>job.description</p>
          </div>
          {isLong && (
            <Button
              type="link"
              size="small"
              onClick={toggleExpanded}
              style={{ padding: 0 }}
            >
              {expanded ? " Show less" : "... Read more"}
            </Button>
          )}
        </Paragraph>
        <ApplyJobModal job={job} />
      </Space>
    </Card>
  );
};

export default CareersClient;
