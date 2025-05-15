"use client";

import { Table, Button, Input, Select, message, Modal } from "antd";
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
    formState: { isValid },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    mode: "onChange",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const openAddModal = () => {
    setEditingCity(null);
    reset();
    setSelectedImageFile(null);
    setModalVisible(true);
  };

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
      setModalVisible(false);
    } catch {
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (record: City) => {
    setEditingCity(record);
    setValue("name", record.name);
    setValue("stateId", record.stateId._id);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this city?");
      if (!confirmed) return;

      await fetch(`/api/cities?id=${id}`, {
        method: "DELETE",
      });

      toast.success("City deleted successfully");
      fetchCities();
    } catch {
      toast.error("Failed to delete city");
    }
  };

  const columns: ColumnsType<City> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "State", dataIndex: ["stateId", "name"], key: "state" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Cities</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add City
        </Button>
      </div>

      <Table
        dataSource={cities}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCity ? "Edit City" : "Add City"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          reset();
          setEditingCity(null);
        }}
        footer={null}
        destroyOnClose
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>State</label>
            <Controller
              name="stateId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Select state"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
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

          <div>
            <label>City Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input size="large" placeholder="City name" {...field} />
              )}
            />
          </div>

          {!editingCity && (
            <div>
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

          <div className="text-right pt-2">
            <Button
              onClick={() => setModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" disabled={!isValid}>
              {editingCity ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
