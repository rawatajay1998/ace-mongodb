"use client";
import { Table, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Define Zod schema for form validation
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
    defaultValues: {
      name: "",
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleReset = () => {
    reset();
    setEditingCategory(null); // Clear the editing state when resetting
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // If editing, send the updated category
        await fetch("/api/categories", {
          method: "PUT", // Use PUT request for updating
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory._id,
            name: data.name,
          }),
        });
        toast.success("Category updated successfully!");
      } else {
        // If adding a new category, send the new category
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("Category added successfully!");
      }

      fetchCategories(); // Refresh the category list
      handleReset(); // Reset the form after successful submission
    } catch (error) {
      toast.error("Failed to save category");
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category); // Set the category being edited
    setValue("name", category.name); // Populate the form with the current category's name
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
      render: (_: unknown, record: Category) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl text-white mb-4">
        {editingCategory ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="form_field">
          <label>Category Name:</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <Input {...field} />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div className="flex gap-4">
          <button
            className="btn_primary"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : editingCategory
              ? "Update Category"
              : "Add Category"}
          </button>
          <button
            className="btn_secondary"
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>

      <h3 className="text-xl text-white mb-4">Categories List</h3>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
}
