import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

interface QueryParams {
  page: string | null;
  limit: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  status: string | null;
  search: string | null;
  highROI: string | null;
  propertyCategoryName: string | null;
  propertySubCategoryName: string | null;
  propertyTypeName: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  minSize: string | null;
  maxSize: string | null;
  beds: string | null;
  bathrooms: string | null;
  amenities: string[] | null;
}

export async function GET(
  req: NextRequest,
  context: { params: { city: string } }
) {
  try {
    await connectDB();

    const { city: cityParam } = context.params;
    const { searchParams } = new URL(req.url);

    const params: QueryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      status: searchParams.get("status"),
      search: searchParams.get("search"),
      highROI: searchParams.get("highROI"),
      propertyCategoryName: searchParams.get("propertyCategoryName"),
      propertySubCategoryName: searchParams.get("propertySubCategoryName"),
      propertyTypeName: searchParams.get("propertyTypeName"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minSize: searchParams.get("minSize"),
      maxSize: searchParams.get("maxSize"),
      beds: searchParams.get("beds"),
      bathrooms: searchParams.get("bathrooms"),
      amenities: searchParams.getAll("amenities"),
    };

    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 12;
    const VALID_SORT_FIELDS = [
      "createdAt",
      "price",
      "name",
      "updatedAt",
      "bedrooms",
    ];

    const page = Math.max(1, parseInt(params.page || "1"));
    const limit = Math.min(
      MAX_LIMIT,
      parseInt(params.limit || DEFAULT_LIMIT.toString())
    );
    const sortBy =
      params.sortBy && VALID_SORT_FIELDS.includes(params.sortBy)
        ? params.sortBy
        : "createdAt";
    const sortOrder = params.sortOrder === "asc" ? 1 : -1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};

    // Safe regex for cityName
    if (cityParam) {
      try {
        const safePattern = `^${cityParam.replace(/[-\s]/g, "[\\s-]*")}$`;
        filters.$or = [
          { cityName: new RegExp(safePattern, "i") },
          { areaName: new RegExp(safePattern, "i") },
        ];
      } catch (err) {
        console.error("Invalid city/area regex:", err);
      }
    }

    if (params.propertyCategoryName) {
      try {
        filters.propertyCategoryName = new RegExp(
          `^${params.propertyCategoryName.replace(/[-\s]/g, "[\\s-]*")}$`,
          "i"
        );
      } catch (err) {
        console.error("Invalid propertyCategoryName regex:", err);
      }
    }

    function buildFlexibleRegex(input: string) {
      // Remove all spaces, hyphens, underscores from input to get a continuous string
      const cleaned = input.replace(/[-_\s]/g, "").toLowerCase();

      // Build regex pattern to match each character with optional separators in between
      // For example, "offplan" -> o[\s_-]*f[\s_-]*f[\s_-]*p[\s_-]*l[\s_-]*a[\s_-]*n
      const pattern = cleaned
        .split("")
        .map((char) => `${char}[\\s_-]*`)
        .join("");

      return new RegExp(`^${pattern}$`, "i");
    }
    if (params.propertySubCategoryName) {
      try {
        filters.propertySubCategoryName = buildFlexibleRegex(
          params.propertySubCategoryName
        );
      } catch (err) {
        console.error("Invalid propertySubCategoryName regex:", err);
      }
    }
    if (params.propertyTypeName) {
      try {
        filters.propertyTypeName = new RegExp(
          `^${params.propertyTypeName.replace(/[-\s]/g, "[\\s-]*")}$`,
          "i"
        );
      } catch (err) {
        console.error("Invalid propertyTypeName regex:", err);
      }
    }

    if (params.status) {
      filters.propertyStatusName = new RegExp(`^${params.status}$`, "i");
    }

    if (params.minPrice || params.maxPrice) {
      filters.price = {};
      if (params.minPrice) filters.price.$gte = parseFloat(params.minPrice);
      if (params.maxPrice) filters.price.$lte = parseFloat(params.maxPrice);
    }

    if (params.minSize || params.maxSize) {
      filters.size = {};
      if (params.minSize) filters.size.$gte = parseFloat(params.minSize);
      if (params.maxSize) filters.size.$lte = parseFloat(params.maxSize);
    }

    if (params.beds) {
      filters.bedrooms = parseInt(params.beds);
    }

    if (params.bathrooms) {
      filters.bathrooms = parseInt(params.bathrooms);
    }

    if (params.amenities?.length) {
      filters.amenities = { $all: params.amenities };
    }

    // if (params.search) {
    //   const searchTerms = params.search.trim().split(/\s+/).filter(Boolean);

    //   if (searchTerms.length > 0) {
    //     filters.$and = searchTerms.map((term) => ({
    //       $or: [
    //         { projectName: { $regex: term, $options: "i" } },
    //         { description: { $regex: term, $options: "i" } },
    //         { address: { $regex: term, $options: "i" } },
    //       ],
    //     }));
    //   }
    // }

    if (params.search) {
      const searchTerms = params.search.trim().split(/\s+/).filter(Boolean);

      if (searchTerms.length > 0) {
        filters.$and = searchTerms.map((term) => ({
          $or: [
            { projectName: { $regex: term, $options: "i" } },
            { propertyTypeName: { $regex: term, $options: "i" } },
            { propertyCategoryName: { $regex: term, $options: "i" } },
            { propertySubCategoryName: { $regex: term, $options: "i" } },
          ],
        }));
      }
    }

    if (params.highROI === "true") {
      filters.highROIProjects = true;
    }

    const sortOptions = {
      [sortBy]: sortOrder,
      ...(sortBy !== "createdAt" ? { createdAt: -1 } : {}),
    };

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(filters).sort(sortOptions).skip(skip).limit(limit).lean(),
      Property.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      data: properties,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages,
        hasMore,
        limit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
