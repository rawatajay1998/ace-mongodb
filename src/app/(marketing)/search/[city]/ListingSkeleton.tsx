"use client";

import { Skeleton } from "antd";

export function ListingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow p-4"
        >
          <div className="flex-1 w-full sm:w-auto sm:flex-[2] space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
            <Skeleton.Input active size="small" className="w-full sm:w-40" />
            <Skeleton.Input active size="small" className="w-full sm:w-32" />
            <Skeleton.Input active size="small" className="w-full sm:w-24" />
            <Skeleton.Input active size="small" className="w-full sm:w-28" />
          </div>

          <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-[1] justify-end w-full">
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
            <Skeleton.Button active size="small" />
          </div>
        </div>
      ))}
    </div>
  );
}
