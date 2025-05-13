"use client";
import React, { useEffect, useState } from "react";
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

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [cities, setCities] = useState<{ _id: string; name: string }[]>([]);

  // fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, cityRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/cities"),
        ]);

        const [catData, cityData] = await Promise.all([
          catRes.json(),
          cityRes.json(),
        ]);

        setCategories(catData);
        setCities(cityData);
      } catch (err) {
        toast.error("Failed to load filter data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const [openFilters, setOpenFilters] = useState(false);

  const onChangeSize = (newValue: number[]) => {
    setSize(newValue);
  };
  const onChangePrice = (newValue: number[]) => {
    setPrice(newValue);
  };

  const router = useRouter();

  const handleSearch = async () => {
    const { type, location } = searchParams;

    if (!type || !location) {
      toast.error("Please select both category and location");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();

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

      const categorySlug = type.toLowerCase().replace(/\s+/g, "-");
      const citySlug = location.toLowerCase().replace(/\s+/g, "-");

      router.push(`/${categorySlug}/${citySlug}?${params.toString()}`);
    } catch (err) {
      toast.error("Search failed");
      console.error(err);
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
          <label>Category</label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select category"
            optionFilterProp="children"
            value={searchParams.type}
            onChange={(value) =>
              setSearchParams({ ...searchParams, type: value })
            }
            options={categories.map((c) => ({
              label: c.name,
              value: c.name,
            }))}
          />
        </div>

        <div className="form_field">
          <label>Location</label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select location"
            optionFilterProp="children"
            value={searchParams.location}
            onChange={(value) =>
              setSearchParams({ ...searchParams, location: value })
            }
            options={cities.map((city) => ({
              label: city.name,
              value: city.name,
            }))}
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
