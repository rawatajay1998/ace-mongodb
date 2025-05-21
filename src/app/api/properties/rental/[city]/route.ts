import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Property from "@/models/property.model";

// Define type-safe query parameters
interface QueryParams {
  page: string | null;
  limit: string | null;
  sortBy: string | null;
  sortOrder: string | null;
  status: string | null;
  type: string | null;
  search: string | null;
  highROI: string | null;
}

export async function GET(
  req: NextRequest,
  context: { params: { city: string } }
) {
  try {
    await connectDB();

    const { city: cityParam } = await context.params;
    const { searchParams } = new URL(req.url);

    const params: QueryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
      status: searchParams.get("status"),
      type: searchParams.get("type"),
      search: searchParams.get("search"),
      highROI: searchParams.get("highROI"),
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
    const status = params.status || undefined;
    const type = params.type || undefined;
    const search = params.search?.trim();
    const highROI = params.highROI === "true";

    // Base filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {
      propertyCategoryName: /rental/i,
      cityName: new RegExp(`^${cityParam.replace(/[-\s]/g, "[\\s-]*")}$`, "i"),
    };

    // Optional filters
    if (status && typeof status === "string") {
      filters.propertyStatusName = new RegExp(`^${status}$`, "i");
    }

    if (type && typeof type === "string") {
      filters.propertyTypeName = new RegExp(`^${type}$`, "i");
    }

    // Enhanced search
    if (search && typeof search === "string") {
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
