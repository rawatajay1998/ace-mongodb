"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  Pagination,
  Space,
  message,
  Upload,
} from "antd";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";

const TipTapEditor = dynamic(
  () => import("@/components/dashboard/text-editor/Editor"),
  {
    ssr: false,
  }
);

type BlogType = {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  subtitle: string;
  content: string;
  slug?: string;
  date?: string;
  thumbnail?: string;
};

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [editorContent, setEditorContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [slug, setSlug] = useState("");

  const pageSize = 10;

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch(`/api/blogs?page=${page}&limit=${pageSize}`);
    const data = await res.json();
    setBlogs(data.data.blogs);
    setTotal(data.data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const generateSlug = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const isEditing = !!editingBlog;

      if (!isEditing && !selectedImageFile) {
        message.error("Thumbnail image is required");
        return;
      }

      const formData = new FormData();
      formData.append("metaTitle", values.metaTitle);
      formData.append("metaDescription", values.metaDescription);
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle || "");
      formData.append("content", editorContent);

      if (selectedImageFile) {
        formData.append("thumbnailFile", selectedImageFile);
      }

      if (isEditing && editingBlog?._id) {
        formData.append("id", editingBlog._id);
      }

      const res = await fetch("/api/blogs", {
        method: isEditing ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        message.success(isEditing ? "Blog updated!" : "Blog created!");
        closeModal();
        fetchBlogs();
      } else {
        const errorData = await res.json();
        message.error(errorData.error || "Error saving blog");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error("Failed to save blog");
    }
  };

  const handleEdit = (blog: BlogType) => {
    setEditingBlog(blog);
    form.setFieldsValue(blog);
    setEditorContent(blog.content);
    setEditorKey((prev) => prev + 1);
    setSlug(generateSlug(blog.title));
    setModalOpen(true);
    setSelectedImageFile(null);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/blogs?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        message.success("Blog deleted!");
        fetchBlogs();
      } else {
        message.error("Error deleting blog");
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditorContent("");
    setEditingBlog(null);
    setSlug("");
    setEditorKey((prev) => prev + 1);
    setSelectedImageFile(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumbnail: string) =>
        thumbnail ? (
          <Image
            src={thumbnail}
            alt="Blog thumbnail"
            width={50}
            height={50}
            className="object-cover"
          />
        ) : null,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      render: (__, record: BlogType) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => confirmDelete(record._id!)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Blog Manager</h2>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            form.resetFields();
            setEditorContent("");
            setEditingBlog(null);
            setEditorKey((prev) => prev + 1);
            setSlug("");
            setSelectedImageFile(null);
          }}
        >
          Add New Blog
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={blogs}
        pagination={false}
        loading={loading}
      />

      <div className="mt-4 flex justify-end">
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>

      <Modal
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        width={800}
      >
        <Form
          layout="vertical"
          form={form}
          onValuesChange={(changedValues) => {
            if (changedValues.title) {
              setSlug(generateSlug(changedValues.title));
            }
          }}
        >
          <Form.Item
            name="metaTitle"
            label="Meta Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="metaDescription"
            label="Meta Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Thumbnail Image"
            rules={[
              {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                validator: (_, value) => {
                  if (editingBlog || selectedImageFile)
                    return Promise.resolve();
                  return Promise.reject("Thumbnail is required");
                },
              },
            ]}
          >
            <Upload
              beforeUpload={(file) => {
                setSelectedImageFile(file);
                return false;
              }}
              onRemove={() => setSelectedImageFile(null)}
              maxCount={1}
              showUploadList={true}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <div className="mt-2">
              {selectedImageFile ? (
                <Image
                  src={URL.createObjectURL(selectedImageFile)}
                  alt="Preview"
                  className="w-20 h-20 object-contain border p-1"
                  width={60}
                  height={60}
                />
              ) : editingBlog?.thumbnail ? (
                <Image
                  src={editingBlog.thumbnail}
                  alt="Existing Thumbnail"
                  className="w-20 h-20 object-contain border p-1"
                  width={60}
                  height={60}
                />
              ) : null}
            </div>
          </Form.Item>

          <Form.Item
            name="title"
            label="Blog Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {slug && (
            <div className="mb-3 text-gray-400 text-sm">
              <strong>Slug:</strong> {slug}
            </div>
          )}

          <Form.Item name="subtitle" label="Subtitle">
            <Input />
          </Form.Item>

          <Form.Item label="Content">
            <TipTapEditor
              key={editorKey}
              initialContent={editorContent}
              onEditorChange={(content: string) => setEditorContent(content)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Yes, Delete"
        okType="danger"
        cancelText="Cancel"
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this blog post? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
