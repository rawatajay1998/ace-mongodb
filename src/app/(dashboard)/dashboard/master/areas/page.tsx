"use client";

import {
  Table,
  Button,
  Input,
  Select,
  Switch,
  Tag,
  Modal,
  Upload,
  Image,
} from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

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
    formState: { isValid },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    mode: "onChange",
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modify fetchAreas to include search parameter
  const fetchAreas = async (search = "") => {
    setLoading(true);
    const res = await fetch(`/api/areas?search=${encodeURIComponent(search)}`);
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

  const openAddModal = () => {
    setEditingArea(null);
    reset();
    setSelectedImageFile(null);
    setModalVisible(true);
  };

  const onSubmit = async (data: AreaFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("cityId", data.cityId);

      if (editingArea) {
        formData.append("id", editingArea._id);
        if (selectedImageFile) {
          formData.append("image", selectedImageFile);
        } else {
          // Send a dummy file when editing but no new image selected
          const dummyFile = new File([""], "dummy.jpg", { type: "image/jpeg" });
          formData.append("image", dummyFile);
        }
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
      setModalVisible(false);
    } catch {
      toast.error("Failed to save area");
    }
  };

  const handleEdit = (record: Area) => {
    setEditingArea(record);
    setValue("name", record.name);
    setValue("cityId", record.cityId._id);
    setModalVisible(true);
  };

  const updateTopLocation = async (id: string, value: boolean) => {
    try {
      await fetch("/api/areas/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, topLocation: value }),
      });
      toast.success("Area status updated");
      fetchAreas();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmed = confirm("Are you sure you want to delete this area?");
      if (!confirmed) return;

      await fetch(`/api/areas?id=${id}`, { method: "DELETE" });
      toast.success("Area deleted successfully");
      fetchAreas();
    } catch {
      toast.error("Failed to delete area");
    }
  };

  const columns: ColumnsType<Area> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              fetchAreas(e.target.value);
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
        </div>
      ),
    },
    { title: "City", dataIndex: ["cityId", "name"], key: "city" },
    {
      title: "Image",
      key: "areaImageUrl",
      render: (_, record) =>
        record.areaImageUrl ? (
          <Image
            src={record.areaImageUrl}
            alt="Area Image"
            height={40}
            width={40}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <span>No Image</span>
        ),
    },
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
        <h2 className="text-xl">Areas</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add Area
        </Button>
      </div>

      <Table
        dataSource={areas}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingArea ? "Edit Area" : "Add Area"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          reset();
          setEditingArea(null);
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>City</label>
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Select city"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {cities.map((city) => (
                    <Option key={city._id} value={city._id}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div>
            <label>Area Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input size="large" placeholder="Area name" {...field} />
              )}
            />
          </div>

          <div>
            <label>Area Image</label>
            <Upload
              beforeUpload={(file) => {
                setSelectedImageFile(file);
                return false;
              }}
              maxCount={1}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {editingArea && (
              <div className="mt-2">
                {selectedImageFile ? (
                  <div className="flex items-center">
                    <span className="mr-2 text-white">
                      Selected Image Preview:
                    </span>
                    <Image
                      src={URL.createObjectURL(selectedImageFile)}
                      alt="Selected Image"
                      className="w-20 h-20 object-contain p-1"
                      height={120}
                      width={120}
                    />
                  </div>
                ) : editingArea.areaImageUrl ? (
                  <div className="flex items-center">
                    <span className="mr-2 text-white">Current Image:</span>
                    <Image
                      src={editingArea.areaImageUrl}
                      height={120}
                      width={120}
                      alt="Current Image"
                      className="w-20 h-20 object-contain p-1"
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="text-right pt-4">
            <Button
              onClick={() => setModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid && !(editingArea && selectedImageFile)}
            >
              {editingArea ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
