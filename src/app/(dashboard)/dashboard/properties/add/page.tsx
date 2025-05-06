"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "antd";

const propertySchema = z.object({
  projectName: z.string().min(1),
  propertyType: z.string(),
  propertyStatus: z.string(),
  city: z.string(),
  area: z.string(),
  areaSize: z.coerce.number().min(1),
  description: z.string().min(5),
  locality: z.string(),
  bathrooms: z.coerce.number(),
  beds: z.coerce.number(),
  propertyPrice: z.coerce.number(),
  thumbnailImage: z.any(),
  bannerImage: z.any(),
  mobileBannerImage: z.any(),
});

export default function AddPropertyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // If value is a FileList (e.g., from an <input type="file" />)
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]); // Only append the first file
        }
      } else {
        formData.append(key, `${value}`);
      }
    });

    const res = await fetch("/api/properties/add", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Property added!");
    } else {
      console.error(await res.json());
      alert("Error adding property");
    }
  };

  return (
    <div className="card">
      <h2 className="main_title">Add Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="form_field">
          <label>Project Name</label>
          <Input
            size="large"
            placeholder="Project Name"
            {...register("projectName")}
          />
        </div>

        <div className="form_field">
          <label>Property Type</label>
          <Input
            size="large"
            placeholder="Property Type"
            {...register("propertyType")}
          />
        </div>

        <div className="form_field">
          <label>Property Status</label>
          <Input
            size="large"
            placeholder="Property Status"
            {...register("propertyStatus")}
          />
        </div>

        <div className="form_field">
          <label>City</label>
          <Input size="large" placeholder="City" {...register("city")} />
        </div>

        <div className="form_field">
          <label>Area</label>
          <Input size="large" placeholder="Area" {...register("area")} />
        </div>

        <div className="form_field">
          <label>Area Size (sq ft)</label>
          <Input
            size="large"
            type="number"
            placeholder="Area Size"
            {...register("areaSize")}
          />
        </div>

        <div className="form_field">
          <label>Locality</label>
          <Input
            size="large"
            placeholder="Locality"
            {...register("locality")}
          />
        </div>

        <div className="form_field">
          <label>Bathrooms</label>
          <Input
            size="large"
            type="number"
            placeholder="Bathrooms"
            {...register("bathrooms")}
          />
        </div>

        <div className="form_field">
          <label>Beds</label>
          <Input
            size="large"
            type="number"
            placeholder="Beds"
            {...register("beds")}
          />
        </div>

        <div className="form_field">
          <label>Property Price</label>
          <Input
            size="large"
            type="number"
            placeholder="Property Price"
            {...register("propertyPrice")}
          />
        </div>

        <div className="form_field">
          <label>Description</label>
          <textarea
            placeholder="Description"
            {...register("description")}
            className="p-2 border rounded-md min-h-[100px]"
          />
        </div>

        <div className="form_field">
          <label>Thumbnail Image</label>
          <input type="file" {...register("thumbnailImage")} />
        </div>

        <div className="form_field">
          <label>Banner Image</label>
          <input type="file" {...register("bannerImage")} />
        </div>

        <div className="form_field">
          <label>Mobile Banner Image</label>
          <input type="file" {...register("mobileBannerImage")} />
        </div>

        <button type="submit" className="btn btn-primary self-start mt-4">
          Add Property
        </button>
      </form>
    </div>
  );
}
