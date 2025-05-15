"use client";

import CityCard from "@/components/marketing/CityCard";
import React, { useEffect, useState } from "react";

export interface ICity {
  _id: string;
  name: string;
  stateId: string;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  propertyCount: number;
  cityImageUrl: string;
}

const TopLocations = () => {
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    const fetchTopLocations = async () => {
      try {
        const res = await fetch(
          "/api/home/featured?category=top-locations&type=table"
        );

        const data = await res.json();
        console.log(data);

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
      {cities.map((cityData) => (
        <CityCard key={cityData._id} {...cityData} />
      ))}
    </div>
  );
};

export default TopLocations;
