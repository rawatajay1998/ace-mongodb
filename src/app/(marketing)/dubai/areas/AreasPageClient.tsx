"use client";

import { MapPin, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

const ClientOnlyMap = dynamic(() => import("./ClientsOnlyMap"), {
  ssr: false,
});

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

export default function AreasPageClient({
  initialAreas,
}: {
  initialAreas: Area[];
}) {
  const [activePosition, setActivePosition] = useState<[number, number] | null>(
    null
  );
  const [activeAreaName, setActiveAreaName] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);

  const handleCardClick = async (area: Area) => {
    let position: [number, number] | null = null;

    if (area.lat && area.lng) {
      position = [area.lat, area.lng];
    } else {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(area.name)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        position = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        alert("Location not found");
        return;
      }
    }

    setActivePosition(position);
    setActiveAreaName(area.name);

    if (window.innerWidth < 768) {
      setShowMobileMap(true);
    }
  };

  return (
    <div className="map-layout">
      <div className="map-sidebar">
        <h2>Areas in Dubai</h2>
        <div className="grid_row">
          {initialAreas.map((area) => (
            <div key={area._id} className="map-card">
              {area.topLocation && (
                <span className="badge">🌟 Top Location</span>
              )}
              <Image
                className="main_image"
                src={area.areaImageUrl}
                alt={area.name}
                width={280}
                height={150}
                style={{ objectFit: "cover", borderRadius: "0.5rem" }}
              />
              <div className="body">
                <h3 className="mb-2">{area.name}</h3>
                <div className="btns_wrapper">
                  <button onClick={() => handleCardClick(area)}>
                    <MapPin size={14} />
                    Locate
                  </button>
                  <Link
                    className="view_properties"
                    href={`/search/${area.slug}`}
                  >
                    View Properties
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Map */}
      <div className="map-container hidden md:block" style={{ flex: 1 }}>
        <ClientOnlyMap
          areas={initialAreas}
          activePosition={activePosition}
          activeAreaName={activeAreaName}
        />
      </div>

      {/* Mobile Slide-Over Map Panel */}
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-white overflow-hidden touch-auto transition-transform transform md:hidden",
          {
            "translate-x-0": showMobileMap,
            "translate-x-full": !showMobileMap,
          }
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Map View</h2>
          <button onClick={() => setShowMobileMap(false)}>
            <X />
          </button>
        </div>
        <div className="h-[calc(100%-56px)] w-full">
          <ClientOnlyMap
            areas={initialAreas}
            activePosition={activePosition}
            activeAreaName={activeAreaName}
          />
        </div>
      </div>
    </div>
  );
}
