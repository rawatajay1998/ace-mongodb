"use client";

import AreaCard from "@/components/marketing/AreaCard";
import React, { useEffect, useState } from "react";

export interface ICity {
  _id: string;
  name: string;
  cityId: string;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  slug: string;
  propertyCount: number;
  areaImageUrl: string;
}

const TopLocations = () => {
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    const fetchTopLocations = async () => {
      try {
        const res = await fetch(
          "/api/home/featured?category=top-locations&type=table&includeCounts=true"
        );

        const data = await res.json();

        if (data) {
          setCities(data.topLocations);
        }
      } catch (error) {
        console.error("Error fetching top locations:", error);
      }
    };

    fetchTopLocations();
  }, []);

  return (
    <div className="city_row">
      {cities.map((areaData) => (
        <AreaCard key={areaData._id} {...areaData} />
      ))}
    </div>
  );
};

export default TopLocations;
