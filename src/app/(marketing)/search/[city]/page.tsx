import { fetchProperties } from "@/lib/fetchProperties";
import { PropertyListing } from "./PropertyListing";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown } from "./SortDropdown";
import { Pagination } from "./Pagination";
import { Metadata } from "next";
import connectDB from "@/lib/db";
import City from "@/models/city.model";

// Helper function to generate canonical URL without query params
const getCanonicalUrl = (city: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/search/${city}`;
};

// Generate dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const { city } = await params;
  const formattedCity = city.replace(/-/g, " ");

  // Validate if city exists (you might need to fetch available cities from your API)
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
    title: `Secondary Properties in ${formattedCity} | Ace Elite Properties`,
    description: `Find the best secondary properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
    alternates: {
      canonical: getCanonicalUrl(city),
    },
    openGraph: {
      title: `Secondary Properties in ${formattedCity} | Ace Elite Properties`,
      description: `Find the best secondary properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
      url: getCanonicalUrl(city),
      siteName: "Ace Elite Properties",
      images: [
        {
          url: "/images/secondary-og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Secondary Properties in ${formattedCity}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Secondary Properties in ${formattedCity} | Ace Elite Properties`,
      description: `Find the best secondary properties in ${formattedCity}. Browse new developments, prices, and investment opportunities.`,
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

function normalizeString(str: string) {
  return str.replace(/[-\s]/g, "").toLowerCase(); // remove hyphens/spaces and lowercase
}

export async function validateCity(slug: string): Promise<boolean> {
  try {
    await connectDB();

    const normalizedInput = normalizeString(slug);

    const city = await City.findOne({
      $expr: {
        $eq: [
          {
            $replaceAll: {
              input: {
                $replaceAll: { input: "$name", find: "-", replacement: "" },
              },
              find: " ",
              replacement: "",
            },
          },
          normalizedInput,
        ],
      },
    })
      .select("_id")
      .lean();

    return !!city;
  } catch (error) {
    console.error("City validation error:", error);
    return false;
  }
}

export default async function SecondaryListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
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
    search: getParam("search"),
    highROI: getParam("highROI") === "true",
  };

  const { data: properties, meta } = await fetchProperties({
    city,
    ...filters,
    highROI: filters.highROI,
  });

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

        <PropertyListing
          properties={properties}
          totalItems={meta.totalItems}
          currentPage={filters.page}
          pageSize={filters.limit}
          error={null}
        />

        <div className="mt-8 text-center">
          <Pagination
            totalItems={meta.totalItems}
            currentPage={filters.page}
            pageSize={filters.limit}
            searchParams={Object.fromEntries(
              Object.entries(resolvedSearchParams).map(([key, value]) => [
                key,
                Array.isArray(value) ? value[0] : value,
              ])
            )}
          />
        </div>
      </div>
    </div>
  );
}
