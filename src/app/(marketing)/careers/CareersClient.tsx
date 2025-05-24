"use client";

import { Card, Tag, Typography, Space, Modal, Button } from "antd";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMore = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const truncated =
    job.description.length > 60
      ? job.description.slice(0, 60) + "..."
      : job.description;

  return (
    <>
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
              return <p key={item}>{item},</p>;
            })}
          </div>

          <div className="flex flex-col" style={{ alignItems: "start" }}>
            <div className="flex items-center">
              <strong className="mr-2">Description:</strong>
              <p className="m-0">{truncated}</p>
            </div>

            {job.description.length > 100 && (
              <Button
                type="link"
                onClick={handleViewMore}
                style={{ paddingLeft: 0, textAlign: "left" }}
              >
                View More
              </Button>
            )}
          </div>

          <ApplyJobModal job={job} />
        </Space>
      </Card>

      <Modal
        title="Full Job Description"
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
      >
        <Paragraph>{job.description}</Paragraph>
      </Modal>
    </>
  );
};

export default CareersClient;
