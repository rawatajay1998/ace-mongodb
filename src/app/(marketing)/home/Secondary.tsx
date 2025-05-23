"use client";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import PropertyCard from "@/components/marketing/PropertyCard";
import { IPropertyCardProps } from "@/types/PropertyCardProps";
import React, { useEffect, useState } from "react";

const SecondaryProperties = () => {
  const [properties, setProperties] = useState<IPropertyCardProps[]>([]);

  useEffect(() => {
    const fetchHighROI = async () => {
      try {
        const res = await fetch(
          "/api/home/featured?category=secondary&type=table"
        );
        const data = await res.json();

        if (data) {
          setProperties(data.properties);
        }
      } catch (error) {
        console.error("Error fetching High ROI properties:", error);
      }
    };

    fetchHighROI();
  }, []);

  return (
    <CarouselWrapper slidesToShow={3}>
      {properties.length > 0 &&
        properties.map((item: IPropertyCardProps) => (
          <div key={item._id} style={{ padding: "0 12px" }}>
            <PropertyCard item={item} />
          </div>
        ))}
    </CarouselWrapper>
  );
};

export default SecondaryProperties;
