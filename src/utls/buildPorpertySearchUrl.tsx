// utils/buildPropertySearchUrl.ts

export interface SearchFilters {
  category?: string;
  subCategory?: string;
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  beds?: string; // string to allow "3+" etc.
  bathrooms?: string;
  amenities?: string[]; // array of strings
}

export function buildPropertySearchUrl(filters: SearchFilters) {
  let slugParts: string[] = [];

  // Build slug parts based on priority:

  // 1. category + city OR propertyType + city
  if (filters.category && filters.city) {
    slugParts = filters.subCategory
      ? [filters.category, filters.subCategory, filters.city] // category/subCategory/city
      : [filters.category, filters.city]; // category/city
  } else if (filters.propertyType && filters.city) {
    slugParts = [filters.propertyType, filters.city]; // propertyType/city
  }

  // Construct query params for filters (excluding those used in slug)
  const params = new URLSearchParams();

  if (filters.minPrice !== undefined)
    params.set("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", filters.maxPrice.toString());
  if (filters.minSize !== undefined)
    params.set("minSize", filters.minSize.toString());
  if (filters.maxSize !== undefined)
    params.set("maxSize", filters.maxSize.toString());
  if (filters.beds) params.set("beds", filters.beds);
  if (filters.bathrooms) params.set("bathrooms", filters.bathrooms);
  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach((amenity) => params.append("amenities", amenity));
  }

  const queryString = params.toString();

  return `/${slugParts.join("/")}${queryString ? `?${queryString}` : ""}`;
}
