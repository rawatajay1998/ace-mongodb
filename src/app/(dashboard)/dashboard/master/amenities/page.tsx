"use client";
import { Table, Button, Input } from "antd";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Image from "next/image";

// Define Zod schema for form validation
const amenitySchema = z.object({
  name: z.string().min(1, "Amenity name is required"),
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Please upload a valid image file",
    }),
});

type AmenityFormData = z.infer<typeof amenitySchema>;

interface Amenity {
  _id: string;
  amenityId: string;
  name: string;
  imageUrl: string;
}

export default function Amenities() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAmenities = async () => {
    try {
      const res = await fetch("/api/amenities");
      const data = await res.json();
      setAmenities(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleReset = () => {
    reset();
    setEditingAmenity(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: AmenityFormData) => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      if (editingAmenity) {
        await fetch("/api/amenities", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAmenity._id, name: data.name }),
        });
        toast.success("Amenity updated successfully!");
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image) {
          formData.append("image", data.image);
        }

        await fetch("/api/amenities", {
          method: "POST",
          body: formData,
        });
        toast.success("Amenity added successfully!");
      }

      fetchAmenities();
      handleReset(); // Reset form after successful submission
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (record: Amenity) => {
    setEditingAmenity(record);
    setValue("name", record.name);
    setFileName("");
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
      title: "Image",
      dataIndex: "imageUrl",
      render: (url: string) => (
        <Image
          src={url}
          alt="Amenity Image"
          width={80}
          height={80}
          className="object-cover"
        />
      ),
    },
    {
      title: "Action",
      render: (_: unknown, record: Amenity) => (
        <Button onClick={() => handleEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl text-white mb-4">
        {editingAmenity ? "Edit Amenity" : "Add Amenity"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="grid grid-cols-2 gap-4">
          {!editingAmenity && (
            <div className="form_field">
              <label>Image:</label>
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, onBlur, name } }) => (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full ant-input ant-input-lg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFileName(file?.name || "");
                        onChange(file || null);
                        if (e.target.files) {
                          fileInputRef.current = e.target;
                        }
                      }}
                      onBlur={onBlur}
                      name={name}
                      ref={(e) => {
                        if (e) {
                          fileInputRef.current = e;
                        }
                      }}
                    />
                    {fileName && (
                      <div className="mt-2 text-sm text-gray-500">
                        Selected: {fileName}
                      </div>
                    )}
                    {errors.image && (
                      <span className="text-red-500">
                        {errors.image.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          )}

          <div className="form_field">
            <label>Amenity Name:</label>
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
        </div>

        <div className="flex gap-4">
          <button
            className="btn_primary"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Processing..." : editingAmenity ? "Update" : "Add"}
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

      <h3 className="text-xl text-white mb-4">Amenities List</h3>
      <Table
        dataSource={amenities}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
}
