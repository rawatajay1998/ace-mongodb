"use client";
import { Table, Button, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const areaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  cityId: z.string().min(1, "City is required"),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface Area {
  _id: string;
  name: string;
  city: { _id: string; name: string };
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

  const fetchAreas = async () => {
    const res = await fetch("/api/areas");
    const data = await res.json();
    setAreas(data);
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
      if (editingArea) {
        await fetch("/api/areas", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingArea._id,
            name: data.name,
            cityId: data.cityId,
          }),
        });
        toast.success("Area updated!");
      } else {
        await fetch("/api/areas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("Area added!");
      }
      fetchAreas();
      reset();
      setEditingArea(null);
    } catch (err) {
      toast.error("Failed to save area");
    }
  };

  const handleEdit = (record: Area) => {
    setEditingArea(record);
    setValue("name", record.name);
    setValue("cityId", record.city._id);
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "City", dataIndex: ["city", "name"], key: "city" },
    {
      title: "Action",
      render: (_: unknown, record: Area) => (
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
            <label>City </label>
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
                <Input placeholder="Area name" {...field} />
              )}
            />
          </div>
        </div>

        <button className="btn_primary" type="submit" disabled={!isValid}>
          {editingArea ? "Update" : "Add"}
        </button>
      </form>

      <Table dataSource={areas} columns={columns} rowKey="_id" />
    </div>
  );
}
