import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

interface QueryParams {
  page: string | null;
  limit: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  status: string | null;
  type: string | null;
  search: string | null;
  highROI: string | null;
  propertyCategoryName: string | null;
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

    // Get all parameters
    const params: QueryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      status: searchParams.get("status"),
      type: searchParams.get("type"),
      search: searchParams.get("search"),
      highROI: searchParams.get("highROI"),
      propertyCategoryName: searchParams.get("propertyCategoryName"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      minSize: searchParams.get("minSize"),
      maxSize: searchParams.get("maxSize"),
      beds: searchParams.get("beds"),
      bathrooms: searchParams.get("bathrooms"),
      amenities: searchParams.getAll("amenities"),
    };

    // Validation and default values
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
    const status = params.status || undefined;
    const type = params.type || undefined;
    const search = params.search?.trim();
    const highROI = params.highROI === "true";
    const propertyCategoryName = params.propertyCategoryName || undefined;

    // Base filters
    const filters: any = {
      cityName: new RegExp(`^${cityParam.replace(/[-\s]/g, "[\\s-]*")}$`, "i"),
    };

    // Property category filter
    if (propertyCategoryName) {
      filters.propertyCategoryName = new RegExp(
        `^${propertyCategoryName.replace(/[-\s]/g, "[\\s-]*")}$`,
        "i"
      );
    }

    // Price range filter
    if (params.minPrice || params.maxPrice) {
      filters.price = {};
      if (params.minPrice) {
        filters.price.$gte = parseFloat(params.minPrice);
      }
      if (params.maxPrice) {
        filters.price.$lte = parseFloat(params.maxPrice);
      }
    }

    // Size range filter
    if (params.minSize || params.maxSize) {
      filters.size = {};
      if (params.minSize) {
        filters.size.$gte = parseFloat(params.minSize);
      }
      if (params.maxSize) {
        filters.size.$lte = parseFloat(params.maxSize);
      }
    }

    // Bedrooms filter
    if (params.beds) {
      filters.bedrooms = {};
      if (params.beds === "3") {
        filters.bedrooms.$gte = 3;
      } else {
        filters.bedrooms.$eq = parseInt(params.beds);
      }
    }

    // Bathrooms filter
    if (params.bathrooms) {
      filters.bathrooms = {};
      if (params.bathrooms === "3") {
        filters.bathrooms.$gte = 3;
      } else {
        filters.bathrooms.$eq = parseInt(params.bathrooms);
      }
    }

    // Amenities filter
    if (params.amenities && params.amenities.length > 0) {
      filters.amenities = { $all: params.amenities };
    }

    // Optional filters
    if (status) {
      filters.propertyStatusName = new RegExp(`^${status}$`, "i");
    }

    if (type) {
      filters.propertyTypeName = new RegExp(`^${type}$`, "i");
    }

    // Enhanced search
    if (search) {
      const searchTerms = search.split(/\s+/).filter((term) => term.length > 0);

      if (searchTerms.length > 0) {
        filters.$and = searchTerms.map((term) => ({
          $or: [
            { projectName: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } },
            { address: { $regex: term, $options: "i" } },
          ],
        }));
      }
    }

    if (highROI) {
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
    console.error("[PROPERTY_FETCH_ERROR]", error);
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
