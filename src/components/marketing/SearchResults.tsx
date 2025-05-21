// app/(routes)/[category]/[location]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Row, Col, Card, Spin, Select, Slider, Pagination } from "antd";
import PropertyCard from "@/components/marketing/PropertyCard";
import { IPropertyCardProps } from "@/types/PropertyCardProps";

const SearchResults = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [properties, setProperties] = useState<IPropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyStatuses, setPropertyStatuses] = useState([]);

  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: 0,
    maxPrice: 20000000,
    sort: "",
    page: 1,
  });

  // Extract category and location from URL
  const segments = pathname.split("/").filter(Boolean);
  const category = segments[0];
  const location = segments[1];

  useEffect(() => {
    const fetchTypesAndStatuses = async () => {
      try {
        const [typesRes, statusRes] = await Promise.all([
          fetch("/api/propertyTypes"),
          fetch("/api/property-statuses"), // assumes you have a similar API
        ]);

        const typesData = await typesRes.json();
        const statusData = await statusRes.json();

        setPropertyTypes(typesData);
        setPropertyStatuses(statusData);
      } catch (err) {
        console.error("Error loading filter options", err);
      }
    };

    fetchTypesAndStatuses();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        category,
        location,
        type: filters.type,
        status: filters.status,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        sort: filters.sort,
        page: filters.page.toString(),
      });

      const res = await fetch(`/api/properties/search?${params.toString()}`);

      const data = await res.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (err) {
      console.error("Error loading properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters, category, location]);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">
        Properties in {location.replace("-", " ")} ({properties.length})
      </h1>

      {/* FILTERS */}
      <div className="bg-white p-4 mb-6 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            placeholder="Property Type"
            value={filters.type}
            onChange={(val) => setFilters({ ...filters, type: val })}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options={propertyTypes.map((t: any) => ({
              label: t.name,
              value: t._id,
            }))}
            allowClear
          />

          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(val) => setFilters({ ...filters, status: val })}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options={propertyStatuses.map((s: any) => ({
              label: s.name,
              value: s._id,
            }))}
            allowClear
          />

          <Slider
            range
            step={50000}
            min={0}
            max={20000000}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={([min, max]) =>
              setFilters({ ...filters, minPrice: min, maxPrice: max })
            }
          />

          <Select
            placeholder="Sort by"
            value={filters.sort}
            onChange={(val) => setFilters({ ...filters, sort: val })}
            options={[
              { label: "Price: Low to High", value: "price_asc" },
              { label: "Price: High to Low", value: "price_desc" },
              { label: "Newest First", value: "date_desc" },
            ]}
            allowClear
          />
        </div>
      </div>

      {/* PROPERTIES */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : properties.length === 0 ? (
        <Card>
          <p className="text-center py-8">No properties found.</p>
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {properties.map((property) => (
              <Col xs={24} sm={12} lg={8} key={property._id}>
                <PropertyCard item={property} />
              </Col>
            ))}
          </Row>

          <div className="flex justify-center mt-10">
            <Pagination
              current={filters.page}
              onChange={(page) => setFilters({ ...filters, page })}
              pageSize={9}
              total={60} // Ideally, get this from API
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
