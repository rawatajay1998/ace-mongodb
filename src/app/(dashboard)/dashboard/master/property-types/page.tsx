"use client";
import { Table, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Property type name is required"),
});

type FormData = z.infer<typeof schema>;

interface PropertyType {
  _id: string;
  name: string;
}

export default function PropertyTypes() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [types, setTypes] = useState<PropertyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<PropertyType | null>(null);

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/propertyTypes");
      const data = await res.json();
      setTypes(data);
    } catch {
      toast.error("Failed to load property types");
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleReset = () => {
    reset();
    setEditing(null);
  };

  const onSubmit = async (data: FormData) => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      if (editing) {
        await fetch("/api/propertyTypes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing._id, name: data.name }),
        });
        toast.success("Updated successfully");
      } else {
        await fetch("/api/propertyTypes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("Added successfully");
      }
      fetchTypes();
      handleReset();
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (type: PropertyType) => {
    setEditing(type);
    setValue("name", type.name);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: PropertyType) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl text-white mb-4">
        {editing ? "Edit Property Type" : "Add Property Type"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="form_field">
          <label>Type Name:</label>
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
        <div className="flex gap-4 mt-4">
          <button
            className="btn_primary"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : editing ? "Update Type" : "Add Type"}
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

      <h3 className="text-xl text-white mb-4">Property Types List</h3>
      <Table
        dataSource={types}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
}
