import React from "react";
import SearchResults from "@/components/marketing/SearchResults";

import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

// Generate dynamic meta based on city
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = decodeURIComponent(params.slug);

  const capitalizedCity =
    city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");

  const title = `Off-Plan Properties in ${capitalizedCity} | Ace Elite Properties`;
  const description = `Explore premium off-plan properties and investment opportunities in ${capitalizedCity}. Discover your next real estate investment with Ace Elite Properties.`;

  const imageUrl =
    "https://aceeliteproperties.com/assets/images/banner-image.webp";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aceeliteproperties.com/offplan/${city}`,
      siteName: "Ace Elite Properties",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const page = () => {
  return <SearchResults />;
};

export default page;
