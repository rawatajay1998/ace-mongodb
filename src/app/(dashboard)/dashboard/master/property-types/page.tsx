"use client";
import { Table, Button, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Zod schema for Property Type
const propertyTypeSchema = z.object({
  name: z.string().min(1, "Property type name is required"),
});

type PropertyTypeFormData = z.infer<typeof propertyTypeSchema>;

interface PropertyType {
  _id: string;
  name: string;
}

export default function PropertyTypesManager() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<PropertyTypeFormData>({
    resolver: zodResolver(propertyTypeSchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [types, setTypes] = useState<PropertyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingType, setEditingType] = useState<PropertyType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/propertyTypes");
      const data = await res.json();
      setTypes(data);
    } catch (error) {
      toast.error("Failed to load property types");
      console.error("Error fetching property types:", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleReset = () => {
    reset();
    setEditingType(null);
  };

  const onSubmit = async (data: PropertyTypeFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingType) {
        await fetch("/api/propertyTypes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingType._id,
            name: data.name,
          }),
        });
        toast.success("Property type updated successfully!");
      } else {
        await fetch("/api/propertyTypes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("Property type added successfully!");
      }

      fetchTypes();
      handleReset();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save property type");
      console.error("Error saving property type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (type: PropertyType) => {
    setEditingType(type);
    setValue("name", type.name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/propertyTypes?id=${deleteId}`, { method: "DELETE" });
      toast.success("Property type deleted");
      fetchTypes();
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
      render: (_: unknown, record: PropertyType) => (
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
        <h2 className="text-xl text-white">Property Types</h2>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Add Property Type
        </Button>
      </div>

      <Table
        dataSource={types}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingType ? "Edit Property Type" : "Add Property Type"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Property Type Name:</label>
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
              {editingType ? "Update" : "Add"}
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
        Are you sure you want to delete this property type? This action cannot
        be undone.
      </Modal>
    </div>
  );
}
