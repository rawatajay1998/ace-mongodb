"use client";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import PropertyCard from "@/components/marketing/PropertyCard";
import { IPropertyCardProps } from "@/types/PropertyCardProps";
import React, { useEffect, useState } from "react";

const FeaturedProperties = () => {
  const category = "featured";
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!category) return;

    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/properties/get/featured`);
        const data = await res.json();

        setProperties(data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [category]);

  return (
    <CarouselWrapper slidesToShow={3}>
      {properties.length > 0 &&
        properties.map((item: IPropertyCardProps) => {
          return (
            <div key={item.projectName} style={{ padding: "0 12px" }}>
              <PropertyCard item={item} />
            </div>
          );
        })}
    </CarouselWrapper>
  );
};

export default FeaturedProperties;
