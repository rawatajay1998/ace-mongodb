"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone number is required"),
  message: z.string().min(5, "Message is required"),
  prjectName: z.string().optional(),
  popupSource: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type PopupFormProps = {
  popupSource?: "brochure";
  propertyName?: string;
};

const PopupForm = ({
  popupSource = "brochure",
  propertyName,
}: PopupFormProps) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const toastId = "contact-enquiry";

    const payload = {
      ...data,
      popupSource,
      propertyName: propertyName || null,
    };

    try {
      const res = await fetch("/api/enquiry/popup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Enquiry sent successfully!", { id: toastId });
        reset();
      } else {
        toast.error("Failed to send enquiry.", { id: toastId });
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
          </svg>
          Contact Our Team for Enquiry
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="form_field">
            <label>
              Name <span>*</span>
            </label>
            <input {...register("name")} placeholder="Enter Name" />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div className="form_field">
            <label>
              Email <span>*</span>
            </label>
            <input {...register("email")} placeholder="Enter Email" />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="form_field">
            <label>
              Phone Number <span>*</span>
            </label>
            <input {...register("phone")} placeholder="Enter Phone" />
            {errors.phone && <p className="error">{errors.phone.message}</p>}
          </div>
        </div>
        <button type="submit" className="submit_btn" disabled={loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              fill="#fff"
              d="M13.3 2.7H2.7A1.3 1.3 0 0 0 1.3 4v8a1.3 1.3 0 0 0 1.4 1.3h10.6a1.3 1.3 0 0 0 1.4-1.3V4a1.3 1.3 0 0 0-1.4-1.3zm0 2.6L8 8.7 2.7 5.3V4L8 7.3 13.3 4z"
            ></path>
            <path fill="none" d="M0 0h16v16H0z"></path>
          </svg>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <Image
          width={1200}
          height={1200}
          src="/assets/images/popup-image-2.png"
          alt="Popup Image"
        />
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default PopupForm;
