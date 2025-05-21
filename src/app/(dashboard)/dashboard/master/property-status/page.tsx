"use client";
import { Table, Button, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Zod schema
const statusSchema = z.object({
  name: z.string().min(1, "Status name is required"),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface PropertyStatus {
  _id: string;
  name: string;
}

export default function PropertyStatusManager() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PropertyStatus | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchStatuses = async () => {
    try {
      const res = await fetch("/api/property-status");
      const data = await res.json();
      setStatuses(data);
    } catch (error) {
      toast.error("Failed to load property statuses");
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleReset = () => {
    reset();
    setEditingStatus(null);
  };

  const onSubmit = async (data: StatusFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingStatus) {
        await fetch("/api/property-status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingStatus._id,
            name: data.name,
          }),
        });
        toast.success("Status updated successfully!");
      } else {
        await fetch("/api/property-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("Status added successfully!");
      }

      fetchStatuses();
      handleReset();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save status");
      console.error("Error saving status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (status: PropertyStatus) => {
    setEditingStatus(status);
    setValue("name", status.name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/property-status?id=${deleteId}`, { method: "DELETE" });
      toast.success("Status deleted");
      fetchStatuses();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      render: (_: unknown, record: PropertyStatus) => (
        <div className="flex gap-2">
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
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white">Property Statuses</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Add Status
        </Button>
      </div>

      <Table
        dataSource={statuses}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingStatus ? "Edit Property Status" : "Add Property Status"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Status Name:</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Input {...field} />
                  {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              {editingStatus ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDelete}
        okText="Yes, Delete"
        okType="danger"
        cancelText="Cancel"
        title="Confirm Deletion"
      >
        Are you sure you want to delete this property status? This action cannot
        be undone.
      </Modal>
    </div>
  );
}
