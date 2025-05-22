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
  const [price, setPrice] = useState<number[]>([99999, 999999]);
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
    if (!searchParams.projectName || searchParams.projectName.trim() === "") {
      toast.error("Please enter search keywords");
      return;
    }

    setLoading(true);
    try {
      const cityName = searchParams.location?.trim() || "Dubai"; // Use selected city or fallback
      const params = new URLSearchParams();

      params.append(
        "propertyCategoryName",
        encodeURIComponent(searchParams.propertyCategoryName || "Residential")
      );

      if (searchParams.projectName.trim()) {
        params.append("search", searchParams.projectName.trim());
      }

      if (price[0] > 0) params.append("minPrice", price[0].toString());
      if (price[1] < 20000000) params.append("maxPrice", price[1].toString());

      if (searchParams.propertySubCategoryName) {
        params.append(
          "propertySubCategoryName",
          encodeURIComponent(searchParams.propertySubCategoryName)
        );
      }

      if (searchParams.propertyTypeName) {
        params.append("propertyTypeName", searchParams.propertyTypeName);
      }

      if (searchParams.propertyStatus) {
        params.append("status", searchParams.propertyStatus);
      }

      const citySlug = cityName.toLowerCase().replace(/\s+/g, "-");
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
    setPrice([99999, 9999999]);
  };

  const categoryOptions = {
    buy: [
      { label: "Off Plan", value: "Off Plan" },
      { label: "Ready to Move", value: "secondary" },
    ],
    rent: [{ label: "Rental", value: "rental" }],
    commercial: [
      { label: "Off Plan", value: "Off Plan" },
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
        <div className="flex items-center gap-2 w-full relative">
          <div className="input_wrapper">
            <Search size={16} color="#0A264A" />
            <input
              className="search_input"
              placeholder="Search Keyword"
              value={searchParams.projectName}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  projectName: e.target.value,
                })
              }
            />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => setOpenFilters(!openFilters)}
            className="filter_btn"
          >
            <SlidersHorizontal size={16} />
          </button>

          {/* Search Button */}
          <button type="submit" className="search_btn">
            <Search size={16} />
          </button>
        </div>
      </form>

      {openFilters && (
        <div className="filters_dropdown" ref={filtersRef}>
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Subcategory Dropdown */}
              <div>
                <label className="block mb-2 font-medium">Subcategory</label>
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

              {/* Location Dropdown */}
              <div>
                <label className="block mb-2 font-medium">Location</label>
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

              {/* Property Type Dropdown */}
              <div>
                <label className="block mb-2 font-medium">Property Type</label>
                <CustomDropdown
                  placeholder="Property Type"
                  options={propertyTypeOptions}
                  value={searchParams.propertyTypeName}
                  onChange={(value: string) =>
                    setSearchParams({
                      ...searchParams,
                      propertyTypeName: value,
                    })
                  }
                />
              </div>

              {/* Property Status Dropdown */}
              <div>
                <label className="block mb-2 font-medium">
                  Property Status
                </label>
                <CustomDropdown
                  placeholder="Property Status"
                  options={propertyStatusOptions}
                  value={searchParams.propertyStatus}
                  onChange={(value: string) =>
                    setSearchParams({ ...searchParams, propertyStatus: value })
                  }
                />
              </div>

              {/* Price Slider */}
              <div className="col-span-full">
                <label className="block mb-2 font-medium">
                  Price Range: {price[0].toLocaleString()} -{" "}
                  {price[1].toLocaleString()}
                </label>
                <Slider
                  onChange={onChangePrice}
                  range
                  value={price}
                  min={99999}
                  max={9999999}
                  step={1000}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                className="reset_btn"
                type="default"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                className="apply_btn"
                type="primary"
                onClick={handleSearch}
                loading={loading}
              >
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
