"use client";
import { Table, Button, Input, Modal } from "antd";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchStates = async () => {
    try {
      const res = await fetch("/api/states");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleReset = () => {
    reset();
    setEditingState(null);
  };

  const openAddModal = () => {
    handleReset();
    setIsModalOpen(true);
  };

  const onSubmit = async (data: StateFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingState) {
        await fetch("/api/states", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingState._id,
            name: data.name,
          }),
        });
        toast.success("State updated!");
      } else {
        await fetch("/api/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name }),
        });
        toast.success("State added!");
      }
      fetchStates();
      setIsModalOpen(false);
      handleReset();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (state: State) => {
    setEditingState(state);
    setValue("name", state.name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/states?id=${deleteId}`, { method: "DELETE" });
      toast.success("State deleted");
      fetchStates();
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
      render: (_: unknown, record: State) => (
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
        <h2 className="text-xl text-white">States</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add State
        </Button>
      </div>

      <Table
        dataSource={states}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingState ? "Edit State" : "Add State"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>State Name:</label>
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
              {editingState ? "Update" : "Add"}
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
        Are you sure you want to delete this state? This action cannot be
        undone.
      </Modal>
    </div>
  );
}
