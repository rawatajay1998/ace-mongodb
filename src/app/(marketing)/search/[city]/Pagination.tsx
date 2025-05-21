"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Pagination as AntPagination } from "antd";

export function Pagination({
  totalItems,
  currentPage,
  pageSize,
  searchParams,
}: {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchParams: Record<string, string>;
}) {
  const router = useRouter();

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  return (
    <AntPagination
      current={currentPage}
      total={totalItems}
      pageSize={pageSize}
      onChange={handlePageChange}
      showSizeChanger={false}
      showQuickJumper
      className="pagination-container"
    />
  );
}
