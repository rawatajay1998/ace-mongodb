// app/api/location/route.ts
import { NextResponse } from "next/server";

// Type definitions
type Country = {
  iso2: string;
  iso3: string;
  country: string;
  cities: string[];
};

type CountriesResponse = {
  error: boolean;
  msg: string;
  data: Country[];
};

export const dynamic = "force-dynamic"; // Disable caching

export async function GET() {
  const API_URL = "https://countriesnow.space/api/v0.1/countries";
  const CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds

  try {
    const response = await fetch(API_URL, {
      next: { revalidate: CACHE_TTL }, // ISR caching
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: CountriesResponse = await response.json();

    if (result.error) {
      throw new Error(result.msg);
    }

    // Transform data if needed
    const countries = result.data.map((country) => ({
      code: country.iso2,
      name: country.country,
      cities: country.cities,
    }));

    return NextResponse.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Countries API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
