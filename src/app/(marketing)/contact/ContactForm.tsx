"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(5, "Phone number is required"),
  role: z.string().min(2, "Please specify your role"),
  message: z.string().min(5, "Message is required"),
  source: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type ContactFormProps = {
  source?: "contact-page" | "property";
  propertyName?: string;
};

const ContactForm = ({
  source = "contact-page",
  propertyName,
}: ContactFormProps) => {
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
      source,
      propertyName: propertyName || null,
    };

    try {
      const res = await fetch("/api/enquiry/contact", {
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
        <h3>Contact Our Team for Enquiry</h3>

        <div className="grid_row">
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

          <div className="form_field">
            <label>
              I am <span>*</span>
            </label>
            <input
              {...register("role")}
              placeholder="Buyer / Seller / Renter"
            />
            {errors.role && <p className="error">{errors.role.message}</p>}
          </div>
        </div>

        <div className="form_field">
          <label>
            Message <span>*</span>
          </label>
          <textarea {...register("message")} placeholder="Message" />
          {errors.message && <p className="error">{errors.message.message}</p>}
        </div>

        <button type="submit" className="submit_btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <Toaster position="top-right" />
    </>
  );
};

export default ContactForm;
