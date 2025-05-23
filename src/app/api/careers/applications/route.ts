import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import JobApplication from "@/models/jobApplication.model";
import { NextResponse } from "next/server";
import "@/models/job.model";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await connectDB();

  try {
    const formData = await request.formData();

    // Extract form data
    const jobId = formData.get("jobId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const experience = formData.get("experience") as string;
    const coverLetter = formData.get("coverLetter") as string | null;
    const resumeFile = formData.get("resume") as File | null;

    const originalFilename = resumeFile.name.split(".")[0];

    // Validate required fields
    if (!jobId || !name || !email || !phone || !experience) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload resume to Cloudinary if exists
    let resumeUrl = "";
    if (resumeFile) {
      const buffer = await resumeFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "job_applications",
              resource_type: "raw",
              public_id: originalFilename,
              format: "pdf",
              unique_filename: true,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          )
          .end(bytes);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resumeUrl = (uploadResult as any).secure_url;
    }

    // Create new application
    const newApplication = new JobApplication({
      jobId,
      name,
      email,
      phone,
      experience,
      coverLetter,
      resumeUrl,
    });

    await newApplication.save();

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: "Failed to submit application" },
      { status: 500 }
    );
  }
}
export const GET = async () => {
  try {
    await connectDB();
    const applications = await JobApplication.find()
      .populate("jobId")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
};

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Fetch the application
    const application = await JobApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Delete the resume file from Cloudinary if exists
    if (application.resumeUrl) {
      const segments = application.resumeUrl.split("/");
      const fileName = segments[segments.length - 1];
      const publicId = fileName.substring(0, fileName.lastIndexOf("."));
      await cloudinary.uploader.destroy(`job_applications/${publicId}`, {
        resource_type: "raw",
      });
    }

    // Delete the document from DB
    await JobApplication.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
