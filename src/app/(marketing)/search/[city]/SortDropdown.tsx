"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Select } from "antd";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "propertyPrice_asc", label: "Price: Low to High" },
  { value: "propertyPrice_desc", label: "Price: High to Low" },
] as const;

export function SortDropdown({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const sortBy = searchParams.sortBy || "createdAt";
  const sortOrder = searchParams.sortOrder || "desc";
  const selectedValue = `${sortBy}_${sortOrder}`;

  const handleSort = useCallback(
    (value: string) => {
      const [sortBy, sortOrder] = value.split("_");

      const params = new URLSearchParams(searchParams);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <Select
      value={selectedValue}
      onChange={handleSort}
      style={{ width: 200 }}
      className="sort-dropdown"
      suffixIcon={
        <ChevronDown
          style={{
            color: "#767676",
            fontSize: 24,
            marginTop: 12,
          }}
        />
      }
      options={SORT_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      }))}
    />
  );
}
