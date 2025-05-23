export async function fetchProperties({
  city,
  page = 1,
  limit = 9,
  sortBy = "createdAt",
  sortOrder = "desc",
  status,
  propertyCategoryName,
  propertySubCategoryName,
  propertyTypeName,
  search,
  highROI,
  minPrice,
  maxPrice,
}: {
  city: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  propertyCategoryName?: string;
  propertySubCategoryName?: string;
  propertyTypeName?: string;
  search?: string;
  signal?: AbortSignal;
  highROI?: boolean;
  minPrice?: string;
  maxPrice?: string;
}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
  });

  if (status) query.set("status", status);
  if (propertyCategoryName)
    query.set("propertyCategoryName", propertyCategoryName);
  if (propertySubCategoryName)
    query.set("propertySubCategoryName", propertySubCategoryName);
  if (propertyTypeName) query.set("propertyTypeName", propertyTypeName);
  if (search) query.set("search", search);
  if (highROI) query.set("highROI", "true");
  if (minPrice) query.set("minPrice", minPrice);
  if (maxPrice) query.set("maxPrice", maxPrice);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${city}?${query.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}
