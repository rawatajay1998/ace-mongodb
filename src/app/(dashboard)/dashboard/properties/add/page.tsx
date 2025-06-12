/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm, Controller, FormProvider, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, Table } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageUpload from "@/components/dashboard/ImageUploader";
import { Plus, Trash2 } from "lucide-react";
import FloorPlanUpload from "@/components/dashboard/FloorPlanUploader";
import toast from "react-hot-toast";
import axios from "axios";

const TipTapEditor = dynamic(
  () => import("@/components/dashboard/text-editor/Editor"),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

interface LocationOption {
  _id: string;
  name: string;
}

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
});

const propertySchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  propertyStatus: z.string().min(1, "Property status is required"),
  propertyCategory: z.string().min(1, "Property category is required"),
  propertySubCategory: z.string().min(1, "Property category is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  developer: z.string().optional(),
  developerName: z.string().optional(),
  propertyType: z
    .array(z.string())
    .min(1, "At least one property type is required"),
  propertyTypeName: z
    .array(z.string())
    .min(1, "At least one property type name is required"),
  propertyStatusName: z.string().min(1, "Property Status is required"),
  propertyCategoryName: z.string().min(1, "Property Category is required"),
  propertySubCategoryName: z.string().min(1, "Property Category is required"),
  stateName: z.string().min(1, "State Name is required"),
  cityName: z.string().min(1, "City name is required"),
  areaName: z.string().min(1, "Area name is required"),
  paymentPlan: z.string(),
  unitType: z.string().min(1, "Unit type is required"),
  metaTitle: z.string().min(1, "Unit type is required"),
  metaDescription: z.string().min(1, "Unit type is required"),
  areaSize: z.coerce.string().min(1, "Area size must be at least 1"),
  aboutProperty: z.string().min(5, "Description must be at least 5 characters"),
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
interface Developer {
  _id: string; // or another type if it's not a string
  developerName: string;
}

const fetchStates = async () => {
  const response = await axios.get("/api/states");

  return response.data; // assuming the response is an array of states
};

const fetchCitiesByState = async (state: string) => {
  const response = await axios.get(`/api/cities?state=${state}`);
  return response.data; // assuming the response is an array of cities
};

const fetchAreasByCity = async (city: string) => {
  const response = await axios.get(`/api/areas?city=${city}`);
  return response.data; // assuming the response is an array of areas
};

export default function AddPropertyForm() {
  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Category[]>([]);
  const [propertyStatusList, setPropertyStatusList] = useState<Category[]>([]);
  const [developerList, setDeveloperList] = useState<Developer[]>([]);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [amenitiesLoaded, setAmenitiesLoaded] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });

  //location apis

  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [areas, setAreas] = useState<LocationOption[]>([]);

  const selectedState = watch("state");
  const selectedCity = watch("city");

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
    fetchCategories();
    fetchSubCategories();
    fetchPropertyTypes();
    fetchPropertyStatuses();
    fetchDevelopers();
  }, []);

  // Load states initially
  useEffect(() => {
    const loadStates = async () => {
      try {
        const stateList = await fetchStates();
        setStates(stateList);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    loadStates();
  }, []);

  // When state changes, reset city & area and fetch cities
  useEffect(() => {
    if (selectedState) {
      const loadCities = async () => {
        try {
          const cityList = await fetchCitiesByState(selectedState);
          setCities(cityList);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      loadCities();
      setValue("city", "");
      setValue("area", "");
      setAreas([]);
    } else {
      setCities([]);
      setValue("city", "");
      setValue("area", "");
      setAreas([]);
    }
  }, [selectedState, setValue]);

  // When city changes, reset area and fetch areas
  useEffect(() => {
    if (selectedCity) {
      const loadAreas = async () => {
        try {
          const areaList = await fetchAreasByCity(selectedCity);
          setAreas(areaList);
        } catch (error) {
          console.error("Error fetching areas:", error);
        }
      };
      loadAreas();
      setValue("area", "");
    } else {
      setAreas([]);
      setValue("area", "");
    }
  }, [selectedCity, setValue]);

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

  // fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategories"); // Fetch categories from your API
      const data = await response.json();
      setSubCategories(data); // Assuming the data is an array of category objects
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
  // fetch propertyTYpes
  const fetchPropertyStatuses = async () => {
    try {
      const response = await fetch("/api/property-status"); // Fetch property types from your API
      const data = await response.json();
      setPropertyStatusList(data); // Assuming the data is an array of property types objects
    } catch {
      toast.error("Failed to load property types");
    }
  };

  // fetch developers
  const fetchDevelopers = async () => {
    try {
      const response = await fetch("/api/developer"); // Fetch property types from your API
      const { data } = await response.json();

      setDeveloperList(data); // Assuming the data is an array of property types objects
    } catch {
      toast.error("Failed to load developers list");
    }
  };

  // on submit property
  const onSubmit = async (data: PropertyFormData) => {
    const formData = new FormData();

    // Create a copy of data without faqs to process normally
    const { faqs, ...otherData } = data;

    // Process all non-faq fields exactly as before
    Object.entries(otherData).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && value[0] instanceof File) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        } else {
          value.forEach((item) => {
            formData.append(key, item.toString());
          });
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Handle FAQs ONLY ONCE as JSON
    if (faqs && faqs.length > 0) {
      formData.append("faqs", JSON.stringify(faqs));
    }

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
            {/* Category Dropdown */}
            <div className="form_field">
              <label>Property Category</label>
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
                    onChange={(value) => {
                      // Find the selected category object
                      const selectedCategory = categories.find(
                        (category) => category._id === value
                      );

                      // Set both ID and Name in form state
                      setValue("propertyCategory", value);
                      setValue(
                        "propertyCategoryName",
                        selectedCategory?.name || ""
                      );
                    }}
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
            {/*Sub Category Dropdown */}
            <div className="form_field">
              <label>Property Sub Category</label>
              <Controller
                name="propertySubCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Select Category"
                    status={errors.propertySubCategory ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      // Find the selected category object
                      const selectedCategory = subCategories.find(
                        (category) => category._id === value
                      );

                      // Set both ID and Name in form state
                      setValue("propertySubCategory", value);
                      setValue(
                        "propertySubCategoryName",
                        selectedCategory?.name || ""
                      );
                    }}
                  >
                    {subCategories.map((category) => (
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

            {/* Property Type */}
            <div className="form_field">
              <label>Property Type</label>
              <Controller
                name="propertyType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    size="large"
                    placeholder="Select Property Type(s)"
                    status={errors.propertyType ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(selectedIds: string[]) => {
                      const selectedTypes = propertyTypes.filter((type) =>
                        selectedIds.includes(type._id)
                      );
                      const names = selectedTypes.map((type) => type.name);

                      // Set both values
                      setValue("propertyType", selectedIds);
                      setValue("propertyTypeName", names);
                    }}
                    value={field.value}
                  >
                    {propertyTypes.map((type) => (
                      <Select.Option key={type._id} value={type._id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.propertyType && (
                <p className="text-red-500">{errors.propertyType.message}</p>
              )}
            </div>

            {/* Property Status */}
            <div className="form_field">
              <label>Property Status</label>
              <Controller
                name="propertyStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Select Porperty Status"
                    status={errors.propertyStatus ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      // Find the selected status object
                      const selectedPropertyStatus = propertyStatusList.find(
                        (status) => status._id === value
                      );

                      // Set both ID and Name in form state
                      setValue("propertyStatus", value);
                      setValue(
                        "propertyStatusName",
                        selectedPropertyStatus?.name || ""
                      );
                    }}
                  >
                    {propertyStatusList.map((status) => (
                      <Select.Option key={status._id} value={status._id}>
                        {status.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.propertyStatus && (
                <p className="text-red-500">{errors.propertyStatus.message}</p>
              )}
            </div>

            {/* developer */}
            <div className="form_field">
              <label>Developer</label>
              <Controller
                name="developer"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear // ✅ Allow clearing the select field
                    size="large"
                    placeholder="Select Developer"
                    showSearch
                    optionFilterProp="children"
                    status={errors.developer ? "error" : undefined}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      if (!value) {
                        setValue("developer", "");
                        setValue("developerName", "");
                        return;
                      }

                      const selectedDeveloper = developerList.find(
                        (dev) => dev._id === value
                      );

                      setValue("developer", value);
                      setValue(
                        "developerName",
                        selectedDeveloper?.developerName || ""
                      );
                    }}
                  >
                    {developerList.map((status) => (
                      <Select.Option key={status._id} value={status._id}>
                        {status.developerName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.developer && (
                <p className="text-red-500">{errors.developer.message}</p>
              )}
            </div>

            {/* state list */}
            <div className="form_field">
              <label>State</label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Select State"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: "100%" }}
                    status={errors.state ? "error" : undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      const selected = states.find((s) => s._id === value);
                      setValue("stateName", selected?.name || "");
                    }}
                  >
                    {states.map((state) => (
                      <Select.Option key={state._id} value={state._id}>
                        {state.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </div>

            {/* City */}
            {selectedState && (
              <div className="form_field">
                <label>City</label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      placeholder="Select City"
                      style={{ width: "100%" }}
                      showSearch
                      optionFilterProp="children"
                      status={errors.city ? "error" : undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        const selected = cities.find((c) => c._id === value);
                        setValue("cityName", selected?.name || "");
                      }}
                    >
                      {cities.map((city) => (
                        <Select.Option key={city._id} value={city._id}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Area */}
            {selectedCity && (
              <div className="form_field">
                <label>Area</label>
                <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      placeholder="Select Area"
                      showSearch
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      status={errors.area ? "error" : undefined}
                      onChange={(value) => {
                        field.onChange(value);
                        const selected = areas.find((a) => a._id === value);
                        setValue("areaName", selected?.name || "");
                      }}
                    >
                      {areas.map((area) => (
                        <Select.Option key={area._id} value={area._id}>
                          {area.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            )}
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
                    type="text"
                    placeholder="Area Size"
                    status={errors.areaSize ? "error" : undefined}
                  />
                )}
              />
              {errors.areaSize && (
                <p className="text-red-500">{errors.areaSize.message}</p>
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

            {/* Payment Plan */}
            <div className="form_field">
              <label>Payment Plan</label>
              <Controller
                name="paymentPlan"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    placeholder="Payment Plan"
                    status={errors.paymentPlan ? "error" : undefined}
                  />
                )}
              />
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
                    maxTagCount={3} // show max 3 selected tags
                    maxTagPlaceholder={(omittedValues) =>
                      `+${omittedValues.length} more`
                    } // custom placeholder text
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

          <div className="form_field">
            <label>Meta Title</label>
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Meta Title"
                  status={errors.metaTitle ? "error" : undefined}
                />
              )}
            />
            {errors.metaTitle && (
              <p className="text-red-500">{errors.metaTitle.message}</p>
            )}
          </div>
          <div className="form_field">
            <label>Meta Description</label>
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="large"
                  placeholder="Meta Description"
                  status={errors.metaDescription ? "error" : undefined}
                />
              )}
            />
            {errors.metaDescription && (
              <p className="text-red-500">{errors.metaDescription.message}</p>
            )}
          </div>

          {/* TipTapEditor fields - you'll need to implement proper onChange handlers */}
          <div className="form_field">
            <label>About</label>
            <TipTapEditor
              onEditorChange={(content) => {
                setValue("aboutProperty", content);
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
            <ImageUpload initialImages={[]} name="galleryImages" />
          </div>

          <div className="form_field">
            <label>Floor PLans</label>
            <FloorPlanUpload initialImages={[]} name="floorPlansImages" />
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
