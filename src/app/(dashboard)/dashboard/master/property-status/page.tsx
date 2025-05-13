"use client";
import { Table, Button, Input } from "antd";
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
    defaultValues: {
      name: "",
    },
  });

  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PropertyStatus | null>(
    null
  );

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
        // PUT update
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
        // POST create
        await fetch("/api/property-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("Status added successfully!");
      }

      fetchStatuses();
      handleReset();
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
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl text-white mb-4">
        {editingStatus ? "Edit Property Status" : "Add Property Status"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="form_field">
          <label>Status Name:</label>
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
              : editingStatus
              ? "Update Status"
              : "Add Status"}
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

      <h3 className="text-xl text-white mb-4">Property Status List</h3>
      <Table
        dataSource={statuses}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
}
