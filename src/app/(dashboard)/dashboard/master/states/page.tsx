"use client";
import { Table, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const stateSchema = z.object({
  name: z.string().min(1, "State name is required"),
});

type StateFormData = z.infer<typeof stateSchema>;

interface State {
  _id: string;
  name: string;
}

export default function StatesPage() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<StateFormData>({
    resolver: zodResolver(stateSchema),
    mode: "onChange",
  });

  const [states, setStates] = useState<State[]>([]);
  const [editingState, setEditingState] = useState<State | null>(null);

  const fetchStates = async () => {
    const res = await fetch("/api/states");
    const data = await res.json();
    setStates(data);
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const onSubmit = async (data: StateFormData) => {
    try {
      if (editingState) {
        await fetch("/api/states", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingState._id, name: data.name }),
        });
        toast.success("State updated!");
      } else {
        await fetch("/api/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        toast.success("State added!");
      }
      fetchStates();
      reset();
      setEditingState(null);
    } catch (err) {
      toast.error("Failed to save state");
    }
  };

  const handleEdit = (record: State) => {
    setEditingState(record);
    setValue("name", record.name);
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      render: (_: unknown, record: State) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl mb-4">
        {editingState ? "Edit State" : "Add State"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="form_field">
          <label>State</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input placeholder="State name" {...field} />
            )}
          />
        </div>
        <button className="btn_primary" type="submit" disabled={!isValid}>
          {editingState ? "Update" : "Add"}
        </button>
      </form>

      <Table dataSource={states} columns={columns} rowKey="_id" />
    </div>
  );
}
