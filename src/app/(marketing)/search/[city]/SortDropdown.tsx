"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Select } from "antd";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
] as const;

export function SortDropdown({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const sortBy = searchParams.sortBy || "createdAt";

  const handleSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("sortBy", value);
      params.set("sortOrder", value.startsWith("-") ? "desc" : "asc");
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <Select
      value={sortBy}
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
