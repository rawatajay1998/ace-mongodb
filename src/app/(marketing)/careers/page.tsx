import { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers | Ace Elite Properties",
  description:
    "Explore exciting job opportunities with us. Join our team and grow your career in a dynamic and innovative environment. Apply now to start your journey!",
  openGraph: {
    title: "Careers | Ace Elite Properties",
    description:
      "Explore exciting job opportunities with us. Join our team and grow your career in a dynamic and innovative environment. Apply now to start your journey!",
    url: "https://aceeliteproperties.com",
    siteName: "Ace Elite Properties",
    images: [
      {
        url: "https://aceeliteproperties.com//assets/images/banner-image.webp",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Ace Elite Properties",
    description:
      "Explore exciting job opportunities with us. Join our team and grow your career in a dynamic and innovative environment. Apply now to start your journey!",
    images: ["https://aceeliteproperties.com//assets/images/banner-image.webp"],
  },
};

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  salary?: string;
  experience?: string;
}

async function getJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/careers`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch job listings");
  }
  return res.json();
}

export default async function CareersPage() {
  const jobs: Job[] = await getJobs();
  return <CareersClient jobs={jobs} />;
}
