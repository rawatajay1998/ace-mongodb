// app/areas/page.tsx
import { Metadata } from "next";
import AreasPageClient from "./AreasPageClient";
import "./style.css";

interface Area {
  _id: string;
  name: string;
  areaImageUrl: string;
  cityId: string;
  slug: string;
  topLocation?: boolean;
  lat?: number;
  lng?: number;
}

export const metadata: Metadata = {
  title: "Explore Top Areas on the Map",
  description:
    "Click on any area to view its location on an interactive map. Perfect for discovering new places in your city!",
};

export default async function AreasPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/areas`, {
    cache: "no-store",
  });
  const areas: Area[] = await res.json();

  return <AreasPageClient initialAreas={areas} />;
}
