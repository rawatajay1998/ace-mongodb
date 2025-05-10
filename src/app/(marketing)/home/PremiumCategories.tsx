"use client";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import PropertyCard from "@/components/marketing/PropertyCard";
import React, { useEffect, useState } from "react";

const PremiumProperties = () => {
  const category = "featured";
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!category) return;

    const fetchProperties = async () => {
      try {
        const res = await fetch(`/api/properties/get/premium`);
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
      <div style={{ padding: "0 12px" }}>
        {properties &&
          properties.map((item) => {
            return <PropertyCard key={item} item={item} />;
          })}
      </div>
    </CarouselWrapper>
  );
};

export default PremiumProperties;
