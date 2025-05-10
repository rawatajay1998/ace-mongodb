import HomePgae from "./(marketing)/home/page";
// app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Ace Elite Properties",
  description: "Discover amazing properties with our real estate platform",
  openGraph: {
    title: "Home | Ace Elite Properties",
    description: "Discover amazing properties with our real estate platform",
    url: "https://aceeliteproperties.com",
    siteName: "Ace Elite Properties",
    images: [
      {
        url: "https://aceeliteproperties.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Your Site Name",
    description: "Discover amazing properties with our real estate platform",
    images: ["https://aceeliteproperties.com/og-image.jpg"],
  },
};

export default function Home() {
  return <HomePgae />;
}
