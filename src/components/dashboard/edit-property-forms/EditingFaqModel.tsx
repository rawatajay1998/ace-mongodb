"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Input,
  Form,
  Button,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const { Title } = Typography;

interface FAQ {
  question: string;
  answer: string;
}

interface EditFAQsModalProps {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
}

export default function EditFAQsModal({
  visible,
  onClose,
  slug,
  onSuccess,
}: EditFAQsModalProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`/api/property/${slug}`);
      setFaqs(res.data.property.faqs || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchFAQs();
    }
  }, [visible, slug]);

  const saveFAQ = async (index: number) => {
    try {
      const values = await form.validateFields();
      const updatedFaqs = [...faqs];
      updatedFaqs[index] = values;

      await axios.put(`/api/property/edit/faq`, {
        slug,
        faqs: updatedFaqs,
      });

      setFaqs(updatedFaqs);
      setEditingIndex(null);
      toast.success("FAQ updated successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const updatedFaqs = [...faqs, values];

      await axios.put(`/api/property/edit/faq`, {
        slug,
        faqs: updatedFaqs,
      });

      setFaqs(updatedFaqs);
      addForm.resetFields();
      toast.success("FAQ added successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const updatedFaqs = faqs.filter((_, i) => i !== index);

      await axios.put(`/api/property/edit/faq`, {
        slug,
        faqs: updatedFaqs,
      });

      setFaqs(updatedFaqs);
      toast.success("FAQ deleted successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      render: (__, record: FAQ, index: number) => {
        if (editingIndex === index) {
          return (
            <Form.Item
              name="question"
              rules={[
                { required: true, message: "Question is required" },
                { min: 10, message: "Question must be at least 10 characters" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea autoSize />
            </Form.Item>
          );
        }
        return record.question;
      },
    },
    {
      title: "Answer",
      dataIndex: "answer",
      render: (__, record: FAQ, index: number) => {
        if (editingIndex === index) {
          return (
            <Form.Item
              name="answer"
              rules={[
                { required: true, message: "Answer is required" },
                { min: 10, message: "Answer must be at least 10 characters" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea autoSize />
            </Form.Item>
          );
        }
        return record.answer;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (__, record: FAQ, index: number) => {
        if (editingIndex === index) {
          return (
            <Space>
              <Button type="primary" onClick={() => saveFAQ(index)}>
                Save
              </Button>
              <Button onClick={() => setEditingIndex(null)}>Cancel</Button>
            </Space>
          );
        }

        return (
          <Space>
            <Button
              onClick={() => {
                form.setFieldsValue(faqs[index]);
                setEditingIndex(index);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this FAQ?"
              onConfirm={() => handleDelete(index)}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      open={visible}
      onCancel={() => {
        setEditingIndex(null);
        onClose();
      }}
      title="Edit FAQs"
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form form={form} component={false}>
        <Table
          dataSource={faqs}
          columns={columns}
          rowKey={(_, index) => index.toString()}
          pagination={false}
        />
      </Form>

      <div className="mt-6">
        <Title level={5}>Add New FAQ</Title>
        <Form layout="vertical" form={addForm} onFinish={handleAdd}>
          <Form.Item
            label="Question"
            name="question"
            rules={[
              { required: true, message: "Question is required" },
              { min: 10, message: "Question must be at least 10 characters" },
            ]}
          >
            <Input.TextArea autoSize />
          </Form.Item>
          <Form.Item
            label="Answer"
            name="answer"
            rules={[
              { required: true, message: "Answer is required" },
              { min: 10, message: "Answer must be at least 10 characters" },
            ]}
          >
            <Input.TextArea autoSize />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add FAQ
          </Button>
        </Form>
      </div>
    </Modal>
  );
}
