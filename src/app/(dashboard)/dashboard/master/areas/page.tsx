/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Table, Button, Input, Select, Switch, Tag } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";

const areaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  cityId: z.string().min(1, "City is required"),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface Area {
  _id: string;
  name: string;
  cityId: { _id: string; name: string };
  areaImageUrl?: string;
  topLocation: boolean;
}

interface City {
  _id: string;
  name: string;
}

export default function AreasPage() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    mode: "onChange",
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    setLoading(true);
    const res = await fetch("/api/areas");
    const data = await res.json();
    setAreas(data);
    setLoading(false);
  };

  const fetchCities = async () => {
    const res = await fetch("/api/cities");
    const data = await res.json();
    setCities(data);
  };

  useEffect(() => {
    fetchAreas();
    fetchCities();
  }, []);

  const onSubmit = async (data: AreaFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("cityId", data.cityId);

      if (editingArea) {
        formData.append("id", editingArea._id);
        const dummyFile = new File(["dummy"], "dummy.jpg", {
          type: "image/jpeg",
        });
        formData.append("image", dummyFile);
      } else if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      } else {
        toast.error("Image is required for new area");
        return;
      }

      await fetch("/api/areas", {
        method: editingArea ? "PUT" : "POST",
        body: formData,
      });

      toast.success(editingArea ? "Area updated!" : "Area added!");
      fetchAreas();
      reset();
      setEditingArea(null);
      setSelectedImageFile(null);
    } catch {
      toast.error("Failed to save area");
    }
  };

  const handleEdit = (record: Area) => {
    setEditingArea(record);
    setValue("name", record.name);
    setValue("cityId", record.cityId._id);
  };

  const updateTopLocation = async (id: string, value: boolean) => {
    try {
      await fetch("/api/areas/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, topLocation: value }),
      });
      toast.success("Area status updated");
      fetchCities();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns: ColumnsType<Area> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "City", dataIndex: ["cityId", "name"], key: "city" },
    {
      title: "Top Location",
      key: "topLocation",
      render: (_, record) => (
        <Switch
          checked={record.topLocation}
          onChange={(checked) => updateTopLocation(record._id, checked)}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record.topLocation ? (
          <Tag color="blue">Top Location</Tag>
        ) : (
          <Tag>Regular</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl mb-4">{editingArea ? "Edit Area" : "Add Area"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="form_field">
            <label>City</label>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Select city"
                  {...field}
                >
                  {cities.map((city) => (
                    <Select.Option key={city._id} value={city._id}>
                      {city.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="form_field">
            <label>Area</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input size="large" placeholder="Area name" {...field} />
              )}
            />
          </div>
          {!editingArea && (
            <div className="form_field col-span-2">
              <label>Area Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedImageFile(file);
                }}
              />
            </div>
          )}
        </div>
        <button className="btn_primary mt-4" type="submit" disabled={!isValid}>
          {editingArea ? "Update" : "Add"}
        </button>
      </form>

      <h2 className="text-xl mb-4">All Areas</h2>
      <Table
        dataSource={areas}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
