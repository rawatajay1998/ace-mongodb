"use client";
import { Table, Button, Input, Modal, Select, Space } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  jobType: z.string().min(1, "Job type is required"),
  description: z.string().optional(),
  requirements: z.string().optional(),
  isActive: z.boolean().default(true),
});

type JobFormData = z.infer<typeof jobSchema>;

interface Job {
  _id: string;
  title: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string;
  isActive: boolean;
}

export default function Jobs() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    trigger,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    mode: "all",
    defaultValues: {
      title: "",
      location: "",
      jobType: "",
      description: "",
      requirements: "",
      isActive: true,
    },
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/careers");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleReset = () => {
    reset();
    setEditingJob(null);
  };

  const openAddModal = () => {
    handleReset();
    setIsModalOpen(true);
  };

  const onSubmit = async (data: JobFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingJob) {
        await fetch("/api/careers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingJob._id, ...data }),
        });
        toast.success("Job updated!");
      } else {
        await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("Job added!");
      }
      fetchJobs();
      setIsModalOpen(false);
      handleReset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (job: Job) => {
    setEditingJob(job);
    reset({
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      description: job.description,
      requirements: job.requirements,
      isActive: job.isActive,
    });
    await trigger();
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/careers?id=${deleteId}`, { method: "DELETE" });
      toast.success("Job deleted");
      fetchJobs();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Type",
      dataIndex: "jobType",
      key: "jobType",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Action",
      render: (_: unknown, record: Job) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              setDeleteId(record._id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white">Jobs</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add Job
        </Button>
      </div>

      <Table
        dataSource={jobs}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingJob ? "Edit Job" : "Add Job"}
        width={800}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Job Title:</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <>
                  <Input {...field} />
                  {errors.title && (
                    <span className="text-red-500 text-sm">
                      {errors.title.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label>Location:</label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div>
            <label>Job Type:</label>
            <Controller
              name="jobType"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                >
                  <Select.Option value="Full-time">Full-time</Select.Option>
                  <Select.Option value="Part-time">Part-time</Select.Option>
                  <Select.Option value="Contract">Contract</Select.Option>
                </Select>
              )}
            />
            {errors.jobType && (
              <span className="text-red-500 text-sm">
                {errors.jobType.message}
              </span>
            )}
          </div>

          <div>
            <label>Description:</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input.TextArea {...field} rows={4} />}
            />
          </div>

          <div>
            <label>Requirements (comma separated):</label>
            <Controller
              name="requirements"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div>
            <label>Active:</label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                >
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid || !isDirty || isSubmitting}
              loading={isSubmitting}
            >
              {editingJob ? "Update" : "Add"}
            </Button>
          </div>
        </form>
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
        Are you sure you want to delete this job? This action cannot be undone.
      </Modal>
    </div>
  );
}
