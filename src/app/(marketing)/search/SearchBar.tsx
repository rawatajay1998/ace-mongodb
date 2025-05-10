"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Button, Input, Select, Slider, Pagination, Spin } from "antd";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Wrap the main component with Suspense
export default function SearchBarWrapper() {
  return (
    <Suspense
      fallback={
        <div className="container py-12 flex justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <SearchBar />
    </Suspense>
  );
}

const SearchBar = () => {
  const router = useRouter();
  const searchParamsFromUrl = useSearchParams();

  const [price, setPrice] = useState<number[]>([1, 20]);
  const [size, setSize] = useState<number[]>([1, 1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    type: undefined as string | undefined,
    location: "",
    projectName: "",
    beds: undefined as string | undefined,
    bathrooms: undefined as string | undefined,
    amenities: [] as string[],
  });

  const [openFilters, setOpenFilters] = useState(false);

  const propertyTypes = [
    { value: "residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Villa", label: "Villa" },
    { value: "Office", label: "Office" },
  ];

  useEffect(() => {
    const parsed = {
      type: searchParamsFromUrl.get("type") || undefined,
      location: searchParamsFromUrl.get("location") || "",
      projectName: searchParamsFromUrl.get("projectName") || "",
      beds: searchParamsFromUrl.get("beds") || undefined,
      bathrooms: searchParamsFromUrl.get("bathrooms") || undefined,
      amenities: searchParamsFromUrl.getAll("amenities") || [],
    };
    setSearchParams(parsed);

    const minPrice = Number(searchParamsFromUrl.get("minPrice") || 1);
    const maxPrice = Number(searchParamsFromUrl.get("maxPrice") || 20);
    setPrice([minPrice, maxPrice]);

    const minSize = Number(searchParamsFromUrl.get("minSize") || 1);
    const maxSize = Number(searchParamsFromUrl.get("maxSize") || 1);
    setSize([minSize, maxSize]);

    const pageParam = Number(searchParamsFromUrl.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParamsFromUrl]);

  const handleSearch = async () => {
    if (!searchParams.location.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchParams.type) params.append("type", searchParams.type);
      if (searchParams.location)
        params.append("location", searchParams.location);
      if (searchParams.projectName)
        params.append("projectName", searchParams.projectName);
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

      setCurrentPage(1);
      params.set("page", "1");

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
    setPrice([1, 20]);
    setSize([1, 1]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <div className="topbar_wrapper">
        <form
          className="search_topbar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="form_field full_span">
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
            className="filter_btn full_span"
            onClick={(e) => {
              e.preventDefault();
              setOpenFilters(!openFilters);
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <button className="search_btn full_span" type="submit">
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
                    onChange={(val) => setPrice(val)}
                    range
                    value={price}
                    min={0}
                    max={20}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Size Range (sqft): {size[0]} - {size[1]}
                  </label>
                  <Slider
                    onChange={(val) => setSize(val)}
                    range
                    value={size}
                    min={0}
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

        {/* Pagination */}
      </div>
      <div className="container pagination_search_container flex justify-between mt-12">
        <div className="mb-6">
          <Link href="/">
            <Button
              className="back_home_btn"
              type="text"
              icon={<ArrowLeft size={16} />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
        <Pagination
          current={currentPage}
          total={10}
          pageSize={10}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};
