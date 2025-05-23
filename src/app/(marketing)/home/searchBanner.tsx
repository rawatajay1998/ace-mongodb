"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Tabs } from "antd";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-48 px-4 py-2 border rounded-lg bg-white"
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-48 bg-white border rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
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
  const [price, setPrice] = useState<number[]>([3000000, 6000000]);
  const [loading, setLoading] = useState(false);

  const [openFilters, setOpenFilters] = useState(false);

  const filtersRef = useRef<HTMLDivElement | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        filtersRef.current?.contains(target) ||
        filterBtnRef.current?.contains(target)
      ) {
        return; // Click was inside the dropdown or the button — do nothing
      }

      setOpenFilters(false); // Click outside — close the dropdown
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [searchParams, setSearchParams] = useState({
    propertyCategoryName: "Residential",
    propertySubCategoryName: undefined,
    location: "",
    projectName: "",
    propertyTypeName: undefined,
    propertyStatus: undefined,
  });

  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ _id: string; name: string }[]>([]);
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
        const [citiesRes, statusRes, typesRes, areasRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/property-status"),
          fetch("/api/propertyTypes"),
          fetch("/api/areas"),
        ]);
        const citiesData = await citiesRes.json();
        const statusData = await statusRes.json();
        const typesData = await typesRes.json();
        const areaData = await areasRes.json();

        setCities(citiesData);
        setAreas(areaData);
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

  const handleSearch = async () => {
    if (!searchParams.projectName || searchParams.projectName.trim() === "") {
      toast.error("Please enter search keywords");
      return;
    }

    setLoading(true);
    try {
      const userInput = searchParams.projectName.trim().toLowerCase();

      // Normalization helper
      const normalizeToSlug = (str: string) =>
        str
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

      // Merge and normalize city/area data
      const allLocations = [...cities, ...(areas || [])].map((loc) => ({
        ...loc,
        slug: normalizeToSlug(loc.name),
      }));

      // Normalize input to a slug format
      const inputSlug = normalizeToSlug(userInput);

      // Match: input appears anywhere in slug
      const matchedLocation =
        allLocations.find((loc) => loc.slug.includes(inputSlug)) ||
        allLocations.find((loc) => inputSlug.includes(loc.slug)) ||
        null;

      const finalSlug = matchedLocation?.slug || "dubai";

      // Construct URL params
      const params = new URLSearchParams();

      params.append(
        "propertyCategoryName",
        encodeURIComponent(searchParams.propertyCategoryName || "Residential")
      );

      if (searchParams.projectName) {
        params.append("search", searchParams.projectName.trim());
      }

      const defaultMin = 500000;
      const defaultMax = 5000000;

      if (price[0] !== defaultMin) {
        params.append("minPrice", price[0].toString());
      }
      if (price[1] !== defaultMax) {
        params.append("maxPrice", price[1].toString());
      }

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

      router.push(`/search/${finalSlug}?${params.toString()}`);
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
    setPrice([3000000, 6000000]);
  };

  const categoryOptions = {
    buy: [
      { label: "Off Plan", value: "Offplan" },
      { label: "Ready to Move", value: "secondary" },
    ],
    rent: [{ label: "Rental", value: "rental" }],
    commercial: [
      { label: "Off Plan", value: "Offplan" },
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
              placeholder="Search Project"
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
            ref={filterBtnRef}
            onClick={() => setOpenFilters((prev) => !prev)}
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

              {/* Price Range Dropdowns using CustomDropdown */}
              <div className="col-span-full">
                <label className="block mb-2 font-medium">
                  Price Range: {price[0].toLocaleString()} AED -{" "}
                  {price[1].toLocaleString()} AED
                </label>
                <div className="flex gap-4">
                  {(() => {
                    const priceOptions = Array.from(
                      {
                        length: Math.floor((50000000 - 3000000) / 3000000) + 1,
                      },
                      (_, i) => {
                        const val = 3000000 + i * 3000000;
                        return { value: val, label: val.toLocaleString() };
                      }
                    );

                    return (
                      <>
                        {/* Min Price Dropdown */}
                        <div className="w-full">
                          <CustomDropdown
                            placeholder="Min Price"
                            value={price[0]}
                            options={priceOptions}
                            onChange={(val: number) => {
                              const newMin = val;
                              const newMax = Math.max(val, price[1]);
                              setPrice([newMin, newMax]);
                            }}
                          />
                        </div>

                        {/* Max Price Dropdown */}
                        <div className="w-full">
                          <CustomDropdown
                            placeholder="Max Price"
                            value={price[1]}
                            options={priceOptions}
                            onChange={(val: number) => {
                              const newMax = val;
                              const newMin = Math.min(price[0], val);
                              setPrice([newMin, newMax]);
                            }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
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
