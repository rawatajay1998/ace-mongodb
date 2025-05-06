// components/AddAgentForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
const agentSchema = z
  .object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    profileImage: z.any(),
    description: z.string().min(10),
    address: z.string().min(5),
    phone: z.string().min(10),
    country: z.string().min(2),
    dob: string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function AddAgentForm() {
  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(agentSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "confirmPassword") {
        // formData.append(key, `${value}`);
        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(key, value[0]); // Only append the first file
          }
        } else {
          formData.append(key, `${value}`);
        }
      }
    });

    const res = await fetch("/api/agents/add", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) alert("Agent created");
    else alert(result.error || "Something went wrong");
  };

  return (
    <div className="card">
      <h2 className="main_title">Add Property</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="form_field">
          <label>First Name</label>
          <Input
            size="large"
            type="text"
            placeholder="First Name"
            {...register("firstname")}
          />
        </div>

        <div className="form_field">
          <label>Last Name</label>
          <Input
            size="large"
            type="text"
            placeholder="Last Name"
            {...register("lastname")}
          />
        </div>

        <div className="form_field">
          <label>Email</label>
          <Input
            size="large"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
        </div>

        <div className="form_field">
          <label>Password</label>
          <Input
            size="large"
            type="password"
            placeholder="Password"
            {...register("password")}
          />
        </div>

        <div className="form_field">
          <label>Confirm Password</label>
          <Input
            size="large"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
        </div>

        <div className="form_field">
          <label>Date of Birth</label>
          <Input
            size="large"
            type="date"
            {...register("dob", { required: true })}
          />
        </div>

        <div className="form_field">
          <label>Profile Image</label>
          <Input size="large" type="file" {...register("profileImage")} />
        </div>

        <div className="form_field">
          <label>Description</label>
          <TextArea
            autoSize={{ minRows: 3, maxRows: 8 }}
            placeholder="Description"
            {...register("description")}
          />
        </div>

        <div className="form_field">
          <label>Address</label>
          <TextArea
            autoSize={{ minRows: 3, maxRows: 8 }}
            placeholder="Address"
            {...register("address")}
          />
        </div>

        <div className="form_field">
          <label>Phone</label>
          <Input
            size="large"
            type="text"
            placeholder="Phone"
            {...register("phone")}
          />
        </div>

        <div className="form_field">
          <label>Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                style={{ width: "100%" }}
                placeholder="Select a country"
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Option value="India">India</Option>
                <Option value="USA">USA</Option>
                <Option value="Canada">Canada</Option>
                <Option value="UK">UK</Option>
                <Option value="Germany">Germany</Option>
                <Option value="Australia">Australia</Option>
                {/* Add more as needed */}
              </Select>
            )}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Agent
        </button>
      </form>
    </div>
  );
}
