"use client";
import { Table, Button, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  stateId: z.string().min(1, "State is required"),
});

type CityFormData = z.infer<typeof citySchema>;

interface City {
  _id: string;
  name: string;
  state: { _id: string; name: string };
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

  const fetchCities = async () => {
    const res = await fetch("/api/cities");
    const data = await res.json();
    setCities(data);
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
      if (editingCity) {
        await fetch("/api/cities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCity._id,
            name: data.name,
            stateId: data.stateId,
          }),
        });
        toast.success("City updated!");
      } else {
        await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("City added!");
      }
      fetchCities();
      reset();
      setEditingCity(null);
    } catch (err) {
      toast.error("Failed to save city");
    }
  };

  const handleEdit = (record: City) => {
    setEditingCity(record);
    setValue("name", record.name);
    setValue("stateId", record.state._id);
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "State", dataIndex: ["state", "name"], key: "state" },
    {
      title: "Action",
      render: (_: unknown, record: City) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl mb-4">{editingCity ? "Edit City" : "Add City"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 ">
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
                <Input placeholder="City name" {...field} />
              )}
            />
          </div>
        </div>
        <button className="btn_primary" type="submit" disabled={!isValid}>
          {editingCity ? "Update" : "Add"}
        </button>
      </form>

      <Table dataSource={cities} columns={columns} rowKey="_id" />
    </div>
  );
}
