"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, Table, Image } from "antd";
import { Plus } from "lucide-react";
import TipTapEditor from "@/components/dashboard/text-editor/Editor";
import ImageUpload from "@/components/dashboard/ImageUploader";
import FloorPlanUpload from "@/components/dashboard/FloorPlanUploader";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
});

const propertySchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  propertyType: z.string().min(1, "Property type is required"),
  propertyStatus: z.string().min(1, "Property status is required"),
  propertyCategory: z.string().min(1, "Property category is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  downPayment: z.string().min(1, "Down Payment is required"),
  handoverDate: z.string().refine(
    (val) => {
      if (!val) return false; // empty string fails
      return !isNaN(new Date(val).getTime()); // check if valid date
    },
    { message: "Please select a valid date" }
  ),
  unitType: z.string().min(1, "Unit type is required"),
  areaSize: z.coerce.number().min(1, "Area size must be at least 1"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  locality: z.string().min(1, "Locality is required"),
  bathrooms: z.coerce.number().min(0, "Must be 0 or more"),
  beds: z.coerce.number().min(0, "Must be 0 or more"),
  propertyPrice: z.coerce.number().min(0, "Price must be 0 or more"),
  thumbnailImage: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "Thumbnail image is required",
    })
    .refine((files) => files.length > 0, {
      message: "Thumbnail image is required",
    }),
  bannerImage: z
    .custom<FileList>((val) => val instanceof FileList, {
      message: "Banner image is required",
    })
    .refine((files) => files.length > 0, {
      message: "Banner image is required",
    }),

  amenities: z.array(z.string()).optional(),
  galleryImages: z.array(z.any()).optional(),
  floorPlansImages: z.array(z.any()).optional(),
  about: z.string().optional(),
  locationAdvantages: z.string().optional(),
  pricingSection: z.string().optional(),
  faqs: z.array(faqSchema).max(5, "Maximum 5 FAQs allowed").optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const EditPropertyPage = () => {
  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      downPayment: "",
      areaSize: 0,
      locality: "",
      bathrooms: 0,
      beds: 0,
      amenities: [],
      description: "",
      faqs: [],
      about: "",
      locationAdvantages: "",
      pricingSection: "",
      thumbnailImage: null,
      bannerImage: null,
    },
  });

  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });
  const [faqs, setFaqs] = useState([]);
  const { id } = useParams();
  const router = useRouter();

  const fetchProperty = async () => {
    try {
      const { data } = await axios.get(`/api/properties/${id}`);
      const property = data;
      setValue("downPayment", property.downPayment);
      setValue("areaSize", property.areaSize);
      setValue("locality", property.locality);
      setValue("bathrooms", property.bathrooms);
      setValue("beds", property.beds);
      setValue("description", property.description);
      setValue("about", property.about);
      setValue("locationAdvantages", property.locationAdvantages);
      setValue("pricingSection", property.pricingSection);
      setValue("thumbnailImage", property.thumbnailImage);
      setValue("bannerImage", property.bannerImage);
      // setFaqs(property.faqs || []);
      // setSelectedAmenities(property.amenities);
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    const { data } = await axios.get("/api/amenities");
    setAmenities(data.amenities);
  };

  const addFaq = () => {
    if (
      currentFaq.question.length >= 10 &&
      currentFaq.answer.length >= 10 &&
      faqs.length < 5
    ) {
      setFaqs([...faqs, currentFaq]);
      setCurrentFaq({ question: "", answer: "" });
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/properties/${id}`, {
        ...data,
        amenities: selectedAmenities,
        faqs,
      });
      router.push("/properties");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const columns = [
    { title: "Question", dataIndex: "question" },
    { title: "Answer", dataIndex: "answer" },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Same fields as AddPropertyPage — but values prefilled via setValue */}

        <div className="form_field">
          <label>Down Payment</label>
          <Controller
            name="downPayment"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                status={errors.downPayment ? "error" : undefined}
              />
            )}
          />
        </div>

        <div className="form_field">
          <label>Area Size (sq ft)</label>
          <Controller
            name="areaSize"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                size="large"
                status={errors.areaSize ? "error" : undefined}
              />
            )}
          />
        </div>

        {/* Locality */}
        <div className="form_field">
          <label>Locality</label>
          <Controller
            name="locality"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                status={errors.locality ? "error" : undefined}
              />
            )}
          />
        </div>

        {/* Amenities */}

        {/* Description */}
        <div className="form_field">
          <label>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="p-2 border rounded-md w-full min-h-[100px]"
              />
            )}
          />
        </div>

        {/* TipTap fields */}
        {["about", "locationAdvantages", "pricingSection"].map((field) => (
          <div className="form_field" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1")}</label>
            <TipTapEditor
              content={getValues(field)}
              onEditorChange={(content) => setValue(field, content)}
            />
          </div>
        ))}

        {/* FAQ */}
        <div className="form_field">
          <label>FAQ</label>
          <div className="grid grid-cols-3 gap-4">
            <Input.TextArea
              value={currentFaq.question}
              onChange={(e) =>
                setCurrentFaq({ ...currentFaq, question: e.target.value })
              }
              placeholder="Question (min 10)"
              rows={3}
            />
            <Input.TextArea
              value={currentFaq.answer}
              onChange={(e) =>
                setCurrentFaq({ ...currentFaq, answer: e.target.value })
              }
              placeholder="Answer (min 10)"
              rows={3}
            />
            <Button
              onClick={addFaq}
              disabled={
                currentFaq.question.length < 10 ||
                currentFaq.answer.length < 10 ||
                faqs.length >= 5
              }
            >
              <Plus size={16} /> Add FAQ
            </Button>
          </div>
          {faqs.length > 0 && (
            <Table
              columns={columns}
              dataSource={faqs}
              pagination={false}
              rowKey="question"
            />
          )}
        </div>

        {/* Image Uploads */}
        <ImageUpload />
        <FloorPlanUpload />

        {/* Thumbnail */}
        <div className="form_field">
          <label>Thumbnail Image</label>
          <input type="file" accept="image/*" {...register("thumbnailImage")} />
        </div>

        <div className="form_field">
          <label>Banner Image</label>
          <input type="file" accept="image/*" {...register("bannerImage")} />
        </div>

        <Button type="primary" htmlType="submit">
          Update Property
        </Button>
      </form>
    </FormProvider>
  );
};

export default EditPropertyPage;
