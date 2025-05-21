"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { AutoComplete, Input, Spin } from "antd";
import { useEffect, useState } from "react";

const agentSchema = z
  .object({
    name: z.string().min(4, "Full name is required"),
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(5, "Mobile number is required"),
    country: z.string().min(1, "Country is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    address: z.string().min(1, "Address is required"),
    about: z.string().min(1, "Description is required"),
    profileImage: z
      .custom<FileList>((val) => val instanceof FileList, {
        message: "Profile image is required",
      })
      .refine((files) => files.length > 0, {
        message: "Profile image is required",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AgentFormData = z.infer<typeof agentSchema>;

const AddAgentForm = () => {
  const [countries, setCountries] = useState<
    { country: string; cities: string[] }[]
  >([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const methods = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset, // To reset the form
  } = methods;

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const data = await response.json();
        if (data.error) throw new Error(data.msg);
        setCountries(data.data);
      } catch (error) {
        toast.error(error);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const onSubmit = async (data: AgentFormData) => {
    setIsSubmitting(true); // Start submitting
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "profileImage") {
        if (value instanceof FileList && value.length > 0) {
          formData.append("profileImage", value[0]);
        }
      } else if (key !== "confirmPassword") {
        formData.append(key, value as string); // Exclude confirmPassword from submission
      }
    });

    try {
      const res = await fetch("/api/agents/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Something went wrong");
        return;
      }

      toast.success("Agent added successfully!");
      reset(); // Reset the form
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false); // End submission
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="card">
        <h2 className="main_title">Add Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="form_field">
              <label>Full Name</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Full Name"
                    status={errors.name ? "error" : undefined}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="form_field">
              <label>Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Email"
                    status={errors.email ? "error" : undefined}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="form_field">
              <label>Mobile Number</label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Mobile Number"
                    status={errors.phoneNumber ? "error" : undefined}
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form_field">
              <label>Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Password"
                    status={errors.password ? "error" : undefined}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form_field">
              <label>Confirm Password</label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    placeholder="Confirm Password"
                    status={errors.confirmPassword ? "error" : undefined}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Country */}
            <div className="form_field">
              <label>Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <AutoComplete
                    className="relative"
                    {...field}
                    onSearch={(value) => field.onChange(value)}
                    placeholder="Search Country"
                    filterOption={(inputValue, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    options={countries.map((c) => ({
                      value: c.country,
                      label: c.country,
                    }))}
                    status={errors.country ? "error" : undefined}
                    style={{ width: "100%" }}
                  >
                    {loadingCountries && (
                      <Spin
                        className="absolute top-[7px] left-[7px]"
                        style={{ padding: "10px", width: "100%" }}
                      />
                    )}
                  </AutoComplete>
                )}
              />
              {errors.country && (
                <p className="text-red-500">{errors.country.message}</p>
              )}
            </div>

            {/* Profile Image */}
            <div className="form_field">
              <label>Profile Image</label>
              <input
                type="file"
                className="w-full rounded-sm p-2"
                accept="image/*"
                {...register("profileImage")}
              />
              {errors.profileImage && (
                <p className="text-red-500">{errors.profileImage.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="form_field">
              <label>Address</label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Address"
                    status={errors.address ? "error" : undefined}
                  />
                )}
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* About */}
            <div className="form_field">
              <label>About</label>
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Description"
                    status={errors.about ? "error" : undefined}
                  />
                )}
              />
              {errors.about && (
                <p className="text-red-500">{errors.about.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn_primary self-start mt-4"
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? <Spin size="small" /> : "Add Agent"}
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

export default AddAgentForm;
