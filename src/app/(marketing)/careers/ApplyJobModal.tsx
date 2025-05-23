"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Typography,
  Tag,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Option } = Select;
const { Text } = Typography;

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  experience?: string;
}

const ApplyJobModal = ({ job }: { job: Job }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleApply = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobId", job._id);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("experience", values.experience);
      if (values.coverLetter)
        formData.append("coverLetter", values.coverLetter);
      if (values.resume) formData.append("resume", values.resume);

      const response = await fetch("/api/careers/applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Application submitted successfully!");
        form.resetFields();
        setFileList([]);
        setVisible(false);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      const isDOC =
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isPDF && !isDOC) {
        message.error("You can only upload PDF or DOC files!");
        return Upload.LIST_IGNORE;
      }
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      form.setFieldValue("resume", file);
      return false;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
    maxCount: 1,
  };

  return (
    <>
      <Button
        type="primary"
        style={{ width: "max-content" }}
        className="btn_primary"
        block
        onClick={() => setVisible(true)}
      >
        Apply Now
      </Button>

      <Modal
        title={`Apply for ${job.title}`}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div className="mb-4">
          <Tag>{job.type}</Tag> <Tag>{job.location}</Tag>
          <Text type="secondary" className="block mt-2">
            {job.salary || "Salary not specified"}
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleApply}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="john@example.com" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="+1 234 567 8900" />
          </Form.Item>

          <Form.Item
            label="Years of Experience"
            name="experience"
            rules={[
              { required: true, message: "Please select your experience!" },
            ]}
          >
            <Select>
              <Option value="0-1 years">0-1 years</Option>
              <Option value="1-3 years">1-3 years</Option>
              <Option value="3-5 years">3-5 years</Option>
              <Option value="5+ years">5+ years</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Cover Letter (Optional)" name="coverLetter">
            <Input.TextArea rows={3} placeholder="Why you're a good fit..." />
          </Form.Item>

          <Form.Item
            label="Upload Resume (PDF/DOC)"
            name="resume"
            rules={[{ required: true, message: "Please upload your resume!" }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Text type="secondary" className="text-xs mt-1 block">
              Max file size: 5MB (PDF/DOC formats)
            </Text>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="btn_primary"
            >
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ApplyJobModal;
