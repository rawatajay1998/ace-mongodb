"use client";

import { Table, Button, Input, Select, Modal, Upload } from "antd";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const developerSchema = z.object({
  developerName: z.string().min(1, "Developer name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  developerAbout: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type DeveloperFormData = z.infer<typeof developerSchema>;

interface IDeveloper {
  _id: string;
  developerName: string;
  state: { _id: string; name: string };
  city: { _id: string; name: string };
  developerLogo?: string;
  developerAbout?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface IState {
  _id: string;
  name: string;
}

interface ICity {
  _id: string;
  name: string;
  stateId: string;
}

export default function DevelopersPage() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    mode: "onChange",
  });

  const [developers, setDevelopers] = useState<IDeveloper[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [filteredCities, setFilteredCities] = useState<ICity[]>([]);
  const [editingDeveloper, setEditingDeveloper] = useState<IDeveloper | null>(
    null
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDevelopers = async () => {
    setLoading(true);
    const res = await fetch("/api/developer");
    const { data } = await res.json();

    setDevelopers(data);
    setLoading(false);
  };

  const fetchStates = async () => {
    const res = await fetch("/api/states");
    const data = await res.json();
    setStates(data);
  };

  const fetchCities = async () => {
    const res = await fetch("/api/cities");
    const data = await res.json();
    setCities(data);
  };

  useEffect(() => {
    fetchDevelopers();
    fetchStates();
    fetchCities();
  }, []);

  const openAddModal = () => {
    setEditingDeveloper(null);
    reset();
    setSelectedImageFile(null);
    setModalVisible(true);
  };

  const onSubmit = async (data: DeveloperFormData) => {
    try {
      const formData = new FormData();
      formData.append("developerName", data.developerName);
      formData.append("state", data.state);
      formData.append("city", data.city);
      if (data.developerAbout)
        formData.append("developerAbout", data.developerAbout);
      if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
      if (data.metaDescription)
        formData.append("metaDescription", data.metaDescription);

      if (editingDeveloper) {
        formData.append("id", editingDeveloper._id);
        if (selectedImageFile) {
          formData.append("developerLogo", selectedImageFile);
        }
      } else if (selectedImageFile) {
        formData.append("developerLogo", selectedImageFile);
      } else {
        toast.error("Developer logo is required for new developer");
        return;
      }

      await fetch("/api/developer", {
        method: editingDeveloper ? "PUT" : "POST",
        body: formData,
      });

      toast.success(
        editingDeveloper ? "Developer updated!" : "Developer added!"
      );
      fetchDevelopers();
      reset();
      setEditingDeveloper(null);
      setModalVisible(false);
    } catch {
      toast.error("Failed to save developer");
    }
  };

  const handleEdit = (record: IDeveloper) => {
    setEditingDeveloper(record);
    setValue("developerName", record.developerName);
    setValue("state", record.state._id);
    setValue("city", record.city._id);
    if (record.developerAbout)
      setValue("developerAbout", record.developerAbout);
    if (record.metaTitle) setValue("metaTitle", record.metaTitle);
    if (record.metaDescription)
      setValue("metaDescription", record.metaDescription);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmed = confirm(
        "Are you sure you want to delete this developer?"
      );
      if (!confirmed) return;

      await fetch(`/api/developer?id=${id}`, { method: "DELETE" });
      toast.success("Developer deleted successfully");
      fetchDevelopers();
    } catch {
      toast.error("Failed to delete developer");
    }
  };

  const handleStateChange = (stateId: string) => {
    const filtered = cities.filter((city) => city.stateId === stateId);
    setFilteredCities(filtered);
    setValue("city", ""); // Reset city when state changes
  };

  const columns: ColumnsType<IDeveloper> = [
    {
      title: "Developer Name",
      dataIndex: "developerName",
      key: "developerName",
    },
    { title: "State", dataIndex: ["state", "name"], key: "state" },
    { title: "City", dataIndex: ["city", "name"], key: "city" },
    {
      title: "Logo",
      key: "developerLogo",
      render: (_, record) =>
        record.developerLogo ? (
          <Image
            src={record.developerLogo}
            alt="Developer Logo"
            height={40}
            width={40}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <span>No Logo</span>
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
        <h2 className="text-xl">Developers</h2>
        <Button type="primary" onClick={openAddModal}>
          + Add Developer
        </Button>
      </div>

      <Table
        dataSource={developers}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title={editingDeveloper ? "Edit Developer" : "Add Developer"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          reset();
          setEditingDeveloper(null);
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>State</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-full"
                    size="large"
                    placeholder="Select state"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      handleStateChange(value);
                    }}
                  >
                    {states.map((state) => (
                      <Option key={state._id} value={state._id}>
                        {state.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div>
              <label>City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-full"
                    size="large"
                    placeholder="Select city"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!filteredCities.length}
                  >
                    {filteredCities.map((city) => (
                      <Option key={city._id} value={city._id}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label>Developer Name</label>
              <Controller
                name="developerName"
                control={control}
                render={({ field }) => (
                  <Input size="large" placeholder="Developer name" {...field} />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label>Developer Logo</label>
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
              {editingDeveloper && (
                <div className="mt-2">
                  {selectedImageFile ? (
                    <div>
                      <span className="mr-2">Selected Logo Preview:</span>
                      <Image
                        src={URL.createObjectURL(selectedImageFile)}
                        alt="Selected Logo"
                        className="w-20 h-20 object-contain border p-1"
                        height={60}
                        width={60}
                      />
                    </div>
                  ) : editingDeveloper.developerLogo ? (
                    <div>
                      <span className="mr-2">Current Logo:</span>
                      <Image
                        src={editingDeveloper.developerLogo}
                        height={60}
                        width={60}
                        alt="Current Logo"
                        className="w-20 h-20 object-contain border p-1"
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label>About Developer</label>
              <Controller
                name="developerAbout"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    rows={4}
                    placeholder="About the developer..."
                    {...field}
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label>Meta Title (SEO)</label>
              <Controller
                name="metaTitle"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Meta title for SEO" {...field} />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label>Meta Description (SEO)</label>
              <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    rows={3}
                    placeholder="Meta description for SEO"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="text-right pt-4">
            <Button
              onClick={() => setModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" disabled={!isValid}>
              {editingDeveloper ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
