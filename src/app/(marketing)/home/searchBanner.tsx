"use client";
import React, { useState } from "react";
import { Button, Input, Select, Slider } from "antd";
import { Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SearchBanner = () => {
  const [size, setSize] = useState<number[]>([1, 1]);
  const [price, setPrice] = useState<number[]>([1, 20]);
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [searchParams, setSearchParams] = useState({
    type: undefined,
    location: "",
    projectName: "",
    beds: undefined,
    bathrooms: undefined,
    amenities: [] as string[],
  });

  const propertyTypes = [
    { value: "residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Villa", label: "Villa" },
    { value: "Office", label: "Office" },
  ];

  const [openFilters, setOpenFilters] = useState(false);

  const onChangeSize = (newValue: number[]) => {
    setSize(newValue);
  };
  const onChangePrice = (newValue: number[]) => {
    setPrice(newValue);
  };

  const router = useRouter();

  const handleSearch = async () => {
    if (!searchParams.location.trim()) {
      toast.error("Please enter a location to search");
      return; // Do not search if location is empty
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Basic search
      if (searchParams.type) params.append("type", searchParams.type);
      if (searchParams.location)
        params.append("location", searchParams.location);
      if (searchParams.projectName)
        params.append("projectName", searchParams.projectName);
      params.append("page", "1");

      // Advanced filters
      if (price[0] > 0) params.append("minPrice", price[0].toString());
      if (price[1] < 20000000) params.append("maxPrice", price[1].toString());
      if (size[0] > 0) params.append("minSize", size[0].toString());
      if (size[1] < 3000) params.append("maxSize", size[1].toString());
      if (searchParams.beds) params.append("beds", searchParams.beds);
      if (searchParams.bathrooms)
        params.append("bathrooms", searchParams.bathrooms);

      searchParams.amenities.forEach((amenity) =>
        params.append("amenities", amenity)
      );

      // Navigate to search results page with all parameters
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching properties");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      type: undefined,
      location: "",
      projectName: "",
      beds: undefined,
      bathrooms: undefined,
      amenities: [],
    });
    setPrice([10000, 1000000]);
    setSize([500, 1000]);
    // setSearchResults([]);
  };

  return (
    <div className="search_form">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="form_field">
          <label>Type</label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select property type"
            optionFilterProp="children"
            value={searchParams.type}
            onChange={(value) =>
              setSearchParams({ ...searchParams, type: value })
            }
            options={propertyTypes}
          />
        </div>

        <div className="form_field">
          <label>Location</label>
          <Input
            placeholder="Search Location"
            value={searchParams.location}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                location: e.target.value,
              })
            }
          />
        </div>

        <div className="form_field">
          <label>Keyword</label>
          <Input
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
        <div className="filters_dropdown">
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Price Range: {price[0]} - {price[1]}
                </label>
                <Slider
                  onChange={onChangePrice}
                  range
                  value={price}
                  min={0}
                  max={1}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Size Range (sqft): {size[0]} - {size[1]}
                </label>
                <Slider
                  onChange={onChangeSize}
                  range
                  min={0}
                  value={size}
                  max={10}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                placeholder="Bedrooms"
                className="w-full"
                size="large"
                value={searchParams.beds}
                onChange={(value) =>
                  setSearchParams({ ...searchParams, beds: value })
                }
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3+</Select.Option>
              </Select>

              <Select
                placeholder="Bathrooms"
                className="w-full"
                size="large"
                value={searchParams.bathrooms}
                onChange={(value) =>
                  setSearchParams({ ...searchParams, bathrooms: value })
                }
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
                <Select.Option value="3">3+</Select.Option>
              </Select>
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
