"use client";
import { Table, Button, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  _id: string;
  name: string;
}

export default function Categories() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleReset = () => {
    reset();
    setEditingCategory(null);
  };

  const openAddModal = () => {
    handleReset();
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory._id,
            name: data.name,
          }),
        });
        toast.success("Category updated!");
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("Category added!");
      }
      fetchCategories();
      setIsModalOpen(false);
      handleReset();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/categories?id=${deleteId}`, { method: "DELETE" });
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Action",
      render: (_: unknown, record: Category) => (
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
        <h2 className="text-xl text-white">Categories</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add Category
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Category Name:</label>
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
              {editingCategory ? "Update" : "Add"}
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
        Are you sure you want to delete this category? This action cannot be
        undone.
      </Modal>
    </div>
  );
}
