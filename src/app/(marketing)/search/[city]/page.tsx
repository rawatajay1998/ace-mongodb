import { fetchProperties } from "@/lib/fetchProperties";
import { PropertyListing } from "./PropertyListing";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { Pagination } from "./Pagination";
import { Metadata } from "next";
import connectDB from "@/lib/db";
import City from "@/models/city.model";
import { Suspense } from "react";
import { ListingSkeleton } from "./ListingSkeleton";

// Helper function to generate canonical URL without query params
const getCanonicalUrl = (city: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/search/${city}`;
};

// Generate dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const { city } = await params;

  const matchedCity = await validateCity(city);
  if (!matchedCity) {
    return { title: "Page Not Found", robots: { index: false, follow: false } };
  }
  const formattedCity = matchedCity;

  // Validate if city exists
  const isValidCity = await validateCity(city);
  if (!isValidCity) {
    return {
      title: "Page Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Properties in ${formattedCity} | Ace Elite Properties`,
    description: `Find the best properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
    alternates: {
      canonical: getCanonicalUrl(city),
    },
    openGraph: {
      title: `Properties in ${formattedCity} | Ace Elite Properties`,
      description: `Find the best properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
      url: getCanonicalUrl(city),
      siteName: "Ace Elite Properties",
      images: [
        {
          url: "/images/secondary-og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Properties in ${formattedCity}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Properties in ${formattedCity} | Ace Elite Properties`,
      description: `Find the best properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
      images: ["/images/secondary-twitter-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
  };
}

export async function validateCity(slug: string): Promise<string | false> {
  try {
    await connectDB();

    const safeRegex = slug.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const city = await City.findOne({
      name: { $regex: `^${safeRegex}$`, $options: "i" },
    })
      .select("name")
      .lean();

    return city?.name || false;
  } catch (error) {
    console.error("City validation error:", error);
    return false;
  }
}

async function PropertyResults({ city, filters }: { city: string; filters }) {
  const { data: properties, meta } = await fetchProperties({
    city,
    ...filters,
    highROI: filters.highROI,
  });

  return (
    <>
      <Suspense fallback={<ListingSkeleton />}>
        <PropertyListing
          properties={properties}
          totalItems={meta.totalItems}
          currentPage={filters.page}
          pageSize={filters.limit}
          error={null}
        />
      </Suspense>

      <div className="mt-8 text-center">
        <Pagination
          totalItems={meta.totalItems}
          currentPage={filters.page}
          pageSize={filters.limit}
          searchParams={filters}
        />
      </div>
    </>
  );
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { city: string };
  searchParams: { [key: string]: string | string[] };
}) {
  const { city } = await params;
  const resolvedSearchParams = await searchParams;

  const getParam = (key: string): string | undefined => {
    const value = resolvedSearchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const filters = {
    page: Number(getParam("page")) || 1,
    limit: 9,
    sortBy: getParam("sortBy") || "createdAt",
    sortOrder: getParam("sortOrder") || "desc",
    status: getParam("status"),
    propertyCategoryName: getParam("propertyCategoryName"),
    propertySubCategoryName: getParam("propertySubCategoryName"),
    propertyTypeName: getParam("propertyTypeName"),
    search: getParam("search"),
    highROI: getParam("highROI") === "true",
  };

  return (
    <div className="listings_page max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <FilterSidebar
        city={city}
        searchParams={Object.fromEntries(
          Object.entries(resolvedSearchParams).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
          ])
        )}
      />
      <div>
        <div className="flex items-center justify-between heading_area">
          <h2 className="main_title">
            Properties in {city.replace(/-/g, " ")}
          </h2>
          <SortDropdown
            searchParams={Object.fromEntries(
              Object.entries(resolvedSearchParams).map(([key, value]) => [
                key,
                Array.isArray(value) ? value[0] : value,
              ])
            )}
          />
        </div>

        <Suspense fallback={<ListingSkeleton />}>
          <PropertyResults city={city} filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
