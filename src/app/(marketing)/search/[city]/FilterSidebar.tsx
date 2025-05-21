"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Input, Select, Switch, Drawer } from "antd";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import axios from "axios";

export function FilterSidebar({
  city,
  searchParams,
}: {
  city: string;
  searchParams: Record<string, string>;
}) {
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.search || "");
  const [status, setStatus] = useState(searchParams.status || "");
  const [type, setType] = useState(searchParams.propertyTypeName || "");
  const [highROI, setHighROI] = useState(searchParams.highROI === "true");
  const [category, setCategory] = useState(
    searchParams.propertyCategoryName || ""
  );
  const [subcategory, setSubcategory] = useState(
    searchParams.propertySubCategoryName || ""
  );
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [statusOptions, setStatusOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [typeOptions, setTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      const handleResize = () => setIsMobile(mediaQuery.matches);
      handleResize();
      mediaQuery.addEventListener("change", handleResize);
      return () => mediaQuery.removeEventListener("change", handleResize);
    }
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [statusRes, typeRes, catRes, subcatRes] = await Promise.all([
          axios.get("/api/property-status"),
          axios.get("/api/propertyTypes"),
          axios.get("/api/categories"),
          axios.get("/api/subcategories"),
        ]);

        const statusOpts = Array.isArray(statusRes.data)
          ? statusRes.data.map((s) => ({ value: s.name, label: s.name }))
          : [];
        const typeOpts = Array.isArray(typeRes.data)
          ? typeRes.data.map((t) => ({ value: t.name, label: t.name }))
          : [];
        const catOpts = Array.isArray(catRes.data)
          ? catRes.data.map((c) => ({ value: c.name, label: c.name }))
          : [];
        const subcatOpts = Array.isArray(subcatRes.data)
          ? subcatRes.data.map((sc) => ({ value: sc.name, label: sc.name }))
          : [];

        setStatusOptions(statusOpts);
        setTypeOptions(typeOpts);
        setCategoryOptions(catOpts);
        setSubcategoryOptions(subcatOpts);
      } catch (err) {
        console.error("Error fetching filter options", err);
      }
    };

    fetchOptions();
  }, []);

  // Sync all filter states when searchParams change
  useEffect(() => {
    setSearch(searchParams.search || "");
    setStatus(searchParams.status || "");
    setType(searchParams.propertyTypeName || "");
    setHighROI(searchParams.highROI === "true");
    setCategory(searchParams.propertyCategoryName || "");
    setSubcategory(searchParams.propertySubCategoryName || "");
  }, [searchParams]);

  // Optionally, keep this if you want to validate status against options:
  useEffect(() => {
    if (statusOptions.length > 0 && searchParams.status) {
      const match = statusOptions.find(
        (opt) => opt.value.toLowerCase() === searchParams.status.toLowerCase()
      );
      if (match) {
        setStatus(match.value);
      } else {
        setStatus("");
      }
    }
  }, [statusOptions, searchParams.status]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (type) params.set("propertyTypeName", type);
    if (highROI) params.set("highROI", "true");
    if (category) params.set("propertyCategoryName", category);
    if (subcategory) params.set("propertySubCategoryName", subcategory);
    params.set("page", "1");
    router.push(`/search/${city}?${params.toString()}`);
    setDrawerVisible(false);
  }, [city, search, status, type, highROI, category, subcategory, router]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setType("");
    setHighROI(false);
    setCategory("");
    setSubcategory("");
    router.push(`/search/${city}`);
    setDrawerVisible(false);
  }, [city, router]);

  const filterContent = (
    <div className="space-y-4 bg-white p-4 rounded shadow listing_sidebar">
      <h4 className="mb-8 text-xl">Filters</h4>

      <div className="filtered_checks">
        <label>High ROI Projects</label>
        <Switch checked={highROI} onChange={setHighROI} />
      </div>

      <Input
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        onPressEnter={applyFilters}
      />

      <div className="pb-4">
        <label className="block mb-1 text-sm font-medium">Category</label>
        <Select
          value={category || undefined}
          onChange={setCategory}
          allowClear
          className="w-full"
          placeholder="Select category"
          suffixIcon={
            <ChevronDown
              style={{ color: "#767676", fontSize: 24, marginTop: 12 }}
            />
          }
          options={categoryOptions}
        />
      </div>

      <div className="pb-4">
        <label className="block mb-1 text-sm font-medium">Subcategory</label>
        <Select
          value={subcategory || undefined}
          onChange={setSubcategory}
          allowClear
          className="w-full"
          placeholder="Select subcategory"
          suffixIcon={
            <ChevronDown
              style={{ color: "#767676", fontSize: 24, marginTop: 12 }}
            />
          }
          options={subcategoryOptions}
        />
      </div>

      <div className="pb-4">
        <label className="block mb-1 text-sm font-medium">Status</label>
        <Select
          value={status || undefined}
          onChange={setStatus}
          allowClear
          className="w-full"
          placeholder="Select status"
          suffixIcon={
            <ChevronDown
              style={{ color: "#767676", fontSize: 24, marginTop: 12 }}
            />
          }
          options={statusOptions}
        />
      </div>

      <div className="pb-4">
        <label className="block mb-1 text-sm font-medium">Type</label>
        <Select
          value={type || undefined}
          onChange={setType}
          allowClear
          className="w-full"
          placeholder="Select type"
          suffixIcon={
            <ChevronDown
              style={{ color: "#767676", fontSize: 24, marginTop: 12 }}
            />
          }
          options={typeOptions}
        />
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <button onClick={clearFilters} className="reset_button">
          Clear All
        </button>
        <button onClick={applyFilters} className="apply_button">
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!isMobile && filterContent}

      {isMobile && (
        <>
          <button
            onClick={() => setDrawerVisible(true)}
            className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-md z-50"
          >
            <SlidersHorizontal size={20} />
          </button>

          <Drawer
            title="Filters"
            placement="bottom"
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            height="auto"
            closable
            className="filter_drawer p-0"
          >
            {filterContent}
          </Drawer>
        </>
      )}
    </>
  );
}
