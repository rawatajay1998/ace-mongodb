import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/models/job.model";

// GET all jobs
export async function GET() {
  await connectDB();
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST new job
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, location, jobType, description, requirements, isActive } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    const newJob = await Job.create({
      title,
      location,
      jobType,
      description,
      requirements,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(newJob);
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PUT update job
export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const {
      id,
      title,
      location,
      jobType,
      description,
      requirements,
      isActive,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, location, jobType, description, requirements, isActive },
      { new: true }
    );

    if (!updatedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Job deleted successfully",
      deletedJob,
    });
  } catch (error) {
    console.error("DELETE /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
