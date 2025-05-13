"use client";

import { Table, Button, Input, Select, Switch, Tag, message } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";

const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  stateId: z.string().min(1, "State is required"),
});

type CityFormData = z.infer<typeof citySchema>;

interface City {
  _id: string;
  name: string;
  stateId: { _id: string; name: string };
  cityImageUrl?: string;
  topLocation: boolean;
}

interface State {
  _id: string;
  name: string;
}

export default function CitiesPage() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    mode: "onChange",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data);
    } catch {
      message.error("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    const res = await fetch("/api/states");
    const data = await res.json();
    setStates(data);
  };

  useEffect(() => {
    fetchCities();
    fetchStates();
  }, []);

  const onSubmit = async (data: CityFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("stateId", data.stateId);

      if (editingCity) {
        formData.append("id", editingCity._id);
        const dummyFile = new File(["dummy"], "dummy.jpg", {
          type: "image/jpeg",
        });
        formData.append("image", dummyFile);
      } else if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      } else {
        toast.error("Image is required for new city");
        return;
      }

      await fetch("/api/cities", {
        method: editingCity ? "PUT" : "POST",
        body: formData,
      });

      toast.success(editingCity ? "City updated!" : "City added!");
      fetchCities();
      reset();
      setEditingCity(null);
      setSelectedImageFile(null);
    } catch {
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (record: City) => {
    setEditingCity(record);
    setValue("name", record.name);
    setValue("stateId", record.stateId._id);
  };

  const updateTopLocation = async (id: string, value: boolean) => {
    try {
      await fetch("/api/cities/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, topLocation: value }),
      });
      message.success("City status updated");
      fetchCities();
    } catch {
      message.error("Failed to update status");
    }
  };

  const columns: ColumnsType<City> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "State", dataIndex: ["stateId", "name"], key: "state" },
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
      <h2 className="text-xl mb-4">{editingCity ? "Edit City" : "Add City"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="form_field">
            <label>State</label>
            <Controller
              name="stateId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Select state"
                  {...field}
                >
                  {states.map((state) => (
                    <Select.Option key={state._id} value={state._id}>
                      {state.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </div>
          <div className="form_field">
            <label>City</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input size="large" placeholder="City name" {...field} />
              )}
            />
          </div>
          {!editingCity && (
            <div className="form_field col-span-2">
              <label>City Image</label>
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
          {editingCity ? "Update" : "Add"}
        </button>
      </form>

      <h2 className="text-xl mb-4">All Cities</h2>
      <Table
        dataSource={cities}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
