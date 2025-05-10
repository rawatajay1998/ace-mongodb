"use client";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AutoComplete,
  Button,
  DatePicker,
  Input,
  Select,
  Spin,
  Table,
} from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/dashboard/ImageUploader";
import { Plus, Trash2 } from "lucide-react";
import FloorPlanUpload from "@/components/dashboard/FloorPlanUploader";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const TipTapEditor = dynamic(
  () => import("@/components/dashboard/text-editor/Editor"),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

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

type Amenity = {
  _id: number;
  name: string;
  imageUrl: string;
};
interface Category {
  _id: string; // or another type if it's not a string
  name: string;
}

export default function AddPropertyForm() {
  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Category[]>([]);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenitiesLoaded, setAmenitiesLoaded] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });

  //location apis
  const [countries, setCountries] = useState<
    { country: string; cities: string[] }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [slug, setSlug] = useState("");

  const projectName = useWatch({
    control,
    name: "projectName",
  });

  useEffect(() => {
    if (projectName) {
      // If it contains a space, replace with dash; else use as-is
      const hasSpaces = /\s/.test(projectName);
      const generatedSlug = hasSpaces
        ? projectName.trim().replace(/\s+/g, "-").toLowerCase()
        : projectName;
      setSlug(generatedSlug);
    } else {
      setSlug("");
    }
  }, [projectName]);

  // manage amenities
  const handleAmenitiesOpen = async () => {
    if (!amenitiesLoaded) {
      try {
        const res = await fetch("/api/amenities");
        const data = await res.json();
        setAmenities(data);
        setAmenitiesLoaded(true);
      } catch (error) {
        console.error("Failed to load amenities", error);
      }
    }
  };

  // add faq
  const addFaq = () => {
    if (
      currentFaq.question.length >= 10 &&
      currentFaq.answer.length >= 10 &&
      faqs.length < 5
    ) {
      const newFaqs = [...faqs, currentFaq];
      setFaqs(newFaqs);
      setValue("faqs", newFaqs);
      setCurrentFaq({ question: "", answer: "" });
    }
  };

  // remove faq
  const removeFaq = (index: number) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
    setValue("faqs", newFaqs);
  };

  // faq columns
  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, __: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<Trash2 size={16} />}
          onClick={() => removeFaq(index)}
        />
      ),
    },
  ];

  // Add this useEffect to fetch countries when component mounts
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
        console.error("Failed to load countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();

    fetchCategories();
    fetchPropertyTypes();
  }, []);

  // Add this function to handle country selection
  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);

    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.msg);
      setCities(data.data);
      setFilteredCities(data.data);
      setValue("city", ""); // Reset city when country changes
    } catch (error) {
      console.error("Failed to load cities:", error);
      toast.error("Failed to load cities");
    }
  };

  // City search handler
  const handleCitySearch = (value: string) => {
    if (value) {
      // Filter cities based on search term
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered); // Update filtered city list
    } else {
      // Reset filtered cities if search term is empty
      setFilteredCities(cities);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories"); // Fetch categories from your API
      const data = await response.json();
      setCategories(data); // Assuming the data is an array of category objects
    } catch {
      toast.error("Failed to load categories");
    }
  };

  // fetch propertyTYpes
  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch("/api/propertyTypes"); // Fetch property types from your API
      const data = await response.json();
      setPropertyTypes(data); // Assuming the data is an array of property types objects
    } catch {
      toast.error("Failed to load property types");
    }
  };

  // on submit property
  const onSubmit = async (data: PropertyFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        if (value[0] instanceof File) {
          // Append all file arrays
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        } else {
          // Append non-file arrays like amenities, faqs
          formData.append(key, JSON.stringify(value));
        }
      } else {
        formData.append(key, String(value));
      }
    });

    // Append FAQs as JSON string
    if (data.faqs && data.faqs.length > 0) {
      formData.append("faqs", JSON.stringify(data.faqs));
    }

    // Append the generated slug
    formData.append("slug", slug);

    try {
      const res = await fetch("/api/properties/add", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Property added successfully!");
      } else {
        const errorData = await res.json();
        console.error(errorData);
        toast(`Error adding property: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast("Network error occurred while adding property");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="card">
        <h2 className="main_title">Add Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Project Name */}
            <div className="form_field">
              <label>Project Name</label>
              <Controller
                name="projectName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Project Name"
                    status={errors.projectName ? "error" : undefined}
                  />
                )}
              />
              {errors.projectName && (
                <p className="text-red-500">{errors.projectName.message}</p>
              )}
            </div>
            <div className="form_field">
              <label>Slug (auto-generated)</label>
              <Input
                value={slug}
                disabled
                size="large"
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            {/* Property Type */}
            <div className="form_field">
              <label>Property Type</label>
              <Controller
                name="propertyType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Select Property"
                    status={errors.propertyType ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(value) => setValue("propertyType", value)} // Set propertyType value
                  >
                    {propertyTypes.map((category) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.propertyType && (
                <p className="text-red-500">{errors.propertyType.message}</p>
              )}
            </div>
            {/* Category Dropdown */}
            <div className="form_field">
              <label>Category</label>
              <Controller
                name="propertyCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Select Category"
                    status={errors.propertyCategory ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(value) => setValue("propertyCategory", value)} // Set propertyCategory value
                  >
                    {categories.map((category) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.propertyCategory && (
                <p className="text-red-500">
                  {errors.propertyCategory.message}
                </p>
              )}
            </div>
            {/* Property Status */}
            <div className="form_field">
              <label>Property Status</label>
              <Controller
                name="propertyStatus"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Property Status"
                    status={errors.propertyStatus ? "error" : undefined}
                  />
                )}
              />
              {errors.propertyStatus && (
                <p className="text-red-500">{errors.propertyStatus.message}</p>
              )}
            </div>
            {/* Unit Type */}
            <div className="form_field">
              <label>Unit Type</label>
              <Controller
                name="unitType"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Unit Type"
                    status={errors.unitType ? "error" : undefined}
                  />
                )}
              />
              {errors.unitType && (
                <p className="text-red-500">{errors.unitType.message}</p>
              )}
            </div>
            {/* Country Dropdown */}
            <div className="form_field">
              <label>Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <AutoComplete
                    className="relative"
                    {...field}
                    onSearch={(value) => field.onChange(value)} // Update field value on search
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
                    onSelect={handleCountryChange} // Handle country change
                  >
                    {/* Show loading spinner inside dropdown */}
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
            {/* City Dropdown */}
            <div className="form_field">
              <label>City</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <AutoComplete
                    {...field}
                    onSearch={handleCitySearch} // Handle search term change
                    placeholder={
                      selectedCountry ? "Search City" : "Select country first"
                    }
                    disabled={!selectedCountry} // Disable city selection if no country is selected
                    filterOption={false} // Let onSearch handle filtering
                    status={errors.city ? "error" : undefined}
                    style={{ width: "100%" }}
                    options={filteredCities.map((city) => ({
                      value: city,
                      label: city,
                    }))}
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-500">{errors.city.message}</p>
              )}
            </div>
            {/* Price */}
            <div className="form_field">
              <label>Price</label>
              <Controller
                name="propertyPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type="number"
                    placeholder="Price"
                    status={errors.propertyPrice ? "error" : undefined}
                  />
                )}
              />
              {errors.propertyPrice && (
                <p className="text-red-500">{errors.propertyPrice.message}</p>
              )}
            </div>
            <div className="form_field">
              <label>Handover Date</label>
              <Controller
                name="handoverDate"
                control={control}
                rules={{ required: "Handover date is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <DatePicker
                      {...field}
                      size="large"
                      placeholder="Select Handover Date"
                      style={{ width: "100%" }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        // Convert to ISO string or empty string
                        const value = date ? date.toISOString() : "";
                        field.onChange(value);
                      }}
                      format="YYYY-MM-DD"
                    />
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            {/* Area */}
            <div className="form_field">
              <label>Down Payment</label>
              <Controller
                name="downPayment"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Down Payment"
                    status={errors.downPayment ? "error" : undefined}
                  />
                )}
              />
              {errors.downPayment && (
                <p className="text-red-500">{errors.downPayment.message}</p>
              )}
            </div>
            {/* Area Size */}
            <div className="form_field">
              <label>Area Size (sq ft)</label>
              <Controller
                name="areaSize"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type="number"
                    placeholder="Area Size"
                    status={errors.areaSize ? "error" : undefined}
                  />
                )}
              />
              {errors.areaSize && (
                <p className="text-red-500">{errors.areaSize.message}</p>
              )}
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
                    placeholder="Locality"
                    status={errors.locality ? "error" : undefined}
                  />
                )}
              />
              {errors.locality && (
                <p className="text-red-500">{errors.locality.message}</p>
              )}
            </div>
            {/* Bathrooms */}
            <div className="form_field">
              <label>Bathrooms</label>
              <Controller
                name="bathrooms"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type="number"
                    placeholder="Bathrooms"
                    status={errors.bathrooms ? "error" : undefined}
                  />
                )}
              />
              {errors.bathrooms && (
                <p className="text-red-500">{errors.bathrooms.message}</p>
              )}
            </div>
            {/* Beds */}
            <div className="form_field">
              <label>Beds</label>
              <Controller
                name="beds"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    type="number"
                    placeholder="Beds"
                    status={errors.beds ? "error" : undefined}
                  />
                )}
              />
              {errors.beds && (
                <p className="text-red-500">{errors.beds.message}</p>
              )}
            </div>
            {/* Amenities */}
            <div className="form_field">
              <label>Amenities</label>
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    placeholder="Select Amenities"
                    value={selectedAmenities}
                    onChange={(value) => {
                      setSelectedAmenities(value);
                      field.onChange(value);
                    }}
                    onDropdownVisibleChange={(open) => {
                      if (open) handleAmenitiesOpen();
                    }}
                    style={{ width: "100%" }}
                    size="large"
                    optionLabelProp="label"
                  >
                    {amenities.map((amenity) => (
                      <Select.Option
                        key={amenity._id}
                        value={amenity._id}
                        label={amenity.name}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={amenity.imageUrl}
                            height={20}
                            width={20}
                            alt={amenity.name}
                            style={{ width: 20, height: 20 }}
                          />
                          {amenity.name}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form_field">
            <label>Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Description"
                  className="p-2 border rounded-md min-h-[100px] w-full"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* TipTapEditor fields - you'll need to implement proper onChange handlers */}
          <div className="form_field">
            <label>About</label>
            <TipTapEditor
              onEditorChange={(content) => {
                setValue("about", content);
              }}
            />
          </div>
          <div className="form_field">
            <label>Location Advantages</label>
            <TipTapEditor
              onEditorChange={(content) => {
                setValue("locationAdvantages", content);
              }}
            />
          </div>
          <div className="form_field">
            <label>Pricing Section</label>
            <TipTapEditor
              onEditorChange={(content) => {
                setValue("pricingSection", content);
              }}
            />
          </div>

          {/* faq starts */}
          <div className="form_field">
            <label>FAQ</label>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="block mb-2">Question</label>
                <Input.TextArea
                  value={currentFaq.question}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, question: e.target.value })
                  }
                  placeholder="Enter question (min 10 characters)"
                  rows={3}
                  status={
                    currentFaq.question.length > 0 &&
                    currentFaq.question.length < 10
                      ? "error"
                      : undefined
                  }
                />
                {currentFaq.question.length > 0 &&
                  currentFaq.question.length < 10 && (
                    <p className="text-red-500 text-sm mt-1">
                      Question must be at least 10 characters
                    </p>
                  )}
              </div>
              <div>
                <label className="block mb-2">Answer</label>
                <Input.TextArea
                  value={currentFaq.answer}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, answer: e.target.value })
                  }
                  placeholder="Enter answer (min 10 characters)"
                  rows={3}
                  status={
                    currentFaq.answer.length > 0 &&
                    currentFaq.answer.length < 10
                      ? "error"
                      : undefined
                  }
                />
                {currentFaq.answer.length > 0 &&
                  currentFaq.answer.length < 10 && (
                    <p className="text-red-500 text-sm mt-1">
                      Answer must be at least 10 characters
                    </p>
                  )}
              </div>
              <Button
                type="primary"
                className="btn btn__primary"
                size="large"
                icon={<Plus size={12} />}
                onClick={addFaq}
                disabled={
                  currentFaq.question.length < 10 ||
                  currentFaq.answer.length < 10 ||
                  faqs.length >= 5
                }
              >
                Add FAQ
              </Button>
            </div>
          </div>
          <div className="mb-6">
            {faqs.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-white font-bold mt-2">
                  {faqs.length}/5 FAQs added
                </p>
                <Table
                  columns={columns}
                  dataSource={faqs}
                  rowKey={(_, index) => (index ? index.toString() : "")}
                  pagination={false}
                  bordered
                  size="small"
                  className="shadow-sm"
                />
              </div>
            )}
          </div>
          {/* faq ends */}

          <div className="form_field">
            <label>Gallery Images</label>
            <ImageUpload />
          </div>

          <div className="form_field">
            <label>Floor PLans</label>
            <FloorPlanUpload />
          </div>

          {/* File Uploads */}
          <div className="form_field">
            <label>Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnailImage")}
            />
            {errors.thumbnailImage && (
              <p className="text-red-500">{errors.thumbnailImage.message}</p>
            )}
          </div>

          <div className="form_field">
            <label>Banner Image</label>
            <input type="file" accept="image/*" {...register("bannerImage")} />
            {errors.bannerImage && (
              <p className="text-red-500">{errors.bannerImage.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn_primary self-start mt-4">
            Add Property
          </button>
        </form>
      </div>
    </FormProvider>
  );
}
