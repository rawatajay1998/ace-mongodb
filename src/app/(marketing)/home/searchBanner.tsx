"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Slider, Tabs } from "antd";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-48 px-4 py-2 border rounded-lg bg-white"
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                value === option.value ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchBanner = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [price, setPrice] = useState<number[]>([1, 20]);
  const [loading, setLoading] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);

  const filtersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setOpenFilters(false);
      }
    };

    if (openFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilters]);

  const [searchParams, setSearchParams] = useState({
    propertyCategoryName: "Residential",
    propertySubCategoryName: undefined,
    location: "",
    projectName: "",
    propertyTypeName: undefined,
    propertyStatus: undefined,
  });

  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]);
  const [propertyStatusOptions, setPropertyStatusOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<
    { value: string; label: string }[]
  >([{ label: "All", value: "" }]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, statusRes, typesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/property-status"),
          fetch("/api/propertyTypes"),
        ]);
        const citiesData = await citiesRes.json();
        const statusData = await statusRes.json();
        const typesData = await typesRes.json();

        setCities(citiesData);
        setPropertyStatusOptions(
          Array.isArray(statusData)
            ? statusData.map((s) => ({ value: s.name, label: s.name }))
            : []
        );
        setPropertyTypeOptions(
          Array.isArray(typesData)
            ? [{ label: "All", value: "" }].concat(
                typesData.map((t) => ({ value: t.name, label: t.name }))
              )
            : [{ label: "All", value: "" }]
        );
      } catch (err) {
        toast.error("Failed to load filter data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const onChangePrice = (newValue: number[]) => setPrice(newValue);

  const handleSearch = async () => {
    const { propertyCategoryName, propertySubCategoryName, location } =
      searchParams;
    if (!propertyCategoryName || !propertySubCategoryName || !location) {
      toast.error("Please select category, subcategory and location");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append(
        "propertyCategoryName",
        encodeURIComponent(propertyCategoryName)
      );
      params.append(
        "propertySubCategoryName",
        encodeURIComponent(propertySubCategoryName)
      );
      if (searchParams.projectName)
        params.append("search", searchParams.projectName);
      if (price[0] > 0) params.append("minPrice", price[0].toString());
      if (price[1] < 20000000) params.append("maxPrice", price[1].toString());
      if (searchParams.propertyTypeName)
        params.append("propertyTypeName", searchParams.propertyTypeName);
      if (searchParams.propertyStatus)
        params.append("status", searchParams.propertyStatus);

      const citySlug = location.toLowerCase().replace(/\s+/g, "-");
      router.push(`/search/${citySlug}?${params.toString()}`);
    } catch (err) {
      toast.error("Search failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      propertyCategoryName: undefined,
      propertySubCategoryName: undefined,
      location: "",
      projectName: "",
      propertyTypeName: undefined,
      propertyStatus: undefined,
    });
    setPrice([10000, 1000000]);
  };

  const categoryOptions = {
    buy: [
      { label: "Off Plan", value: "offplan" },
      { label: "Ready to Move", value: "secondary" },
    ],
    rent: [{ label: "Rental", value: "rental" }],
    commercial: [
      { label: "Off Plan", value: "offplan" },
      { label: "Ready to Move", value: "secondary" },
      { label: "Rental", value: "rental" },
    ],
  };

  const tabToCategoryName = {
    buy: "Residential",
    rent: "Rent",
    commercial: "Commercial",
  };

  return (
    <div className="search_form">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setSearchParams((prev) => ({
            ...prev,
            propertyCategoryName: tabToCategoryName[key], // use mapping with Residential for buy
            propertySubCategoryName: undefined,
          }));
        }}
        items={[
          { key: "buy", label: "Buy" },
          { key: "rent", label: "Rent" },
          { key: "commercial", label: "Commercial" },
        ]}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="form_field custom_dropdown">
          <label>Subcategory</label>
          <CustomDropdown
            placeholder="Select subcategory"
            options={categoryOptions[activeTab]}
            value={searchParams.propertySubCategoryName}
            onChange={(value: string) =>
              setSearchParams({
                ...searchParams,
                propertySubCategoryName: value,
              })
            }
          />
        </div>

        <div className="form_field custom_dropdown">
          <label>Location</label>
          <CustomDropdown
            placeholder="Select location"
            options={cities.map((city) => ({
              label: city.name,
              value: city.name,
            }))}
            value={searchParams.location}
            onChange={(value: string) =>
              setSearchParams({ ...searchParams, location: value })
            }
          />
        </div>

        <div className="form_field">
          <label>Keyword</label>
          <input
            className="flex justify-between items-center w-48 px-4 py-2 border rounded-lg text-[#121212]"
            placeholder="Search Keyword"
            value={searchParams.projectName}
            onChange={(e) =>
              setSearchParams({ ...searchParams, projectName: e.target.value })
            }
          />
        </div>

        <button
          className="filter_btn"
          onClick={(e) => {
            e.preventDefault();
            setOpenFilters(!openFilters);
          }}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <button className="search_btn" type="submit">
          <Search size={16} />
          Search
        </button>
      </form>

      {openFilters && (
        <div className="filters_dropdown" ref={filtersRef}>
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Price Range: {price[0]} - {price[1]}
                </label>
                <Slider
                  onChange={onChangePrice}
                  range
                  value={price}
                  min={0}
                  max={20}
                />
              </div>
              <CustomDropdown
                placeholder="Property Type"
                options={propertyTypeOptions}
                value={searchParams.propertyTypeName}
                onChange={(value: string) =>
                  setSearchParams({ ...searchParams, propertyTypeName: value })
                }
              />

              <CustomDropdown
                placeholder="Property Status"
                options={propertyStatusOptions}
                value={searchParams.propertyStatus}
                onChange={(value: string) =>
                  setSearchParams({ ...searchParams, propertyStatus: value })
                }
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="default" onClick={handleReset}>
                Reset
              </Button>
              <Button type="primary" onClick={handleSearch} loading={loading}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBanner;
