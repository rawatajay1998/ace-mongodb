"use client";

import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import PropertyCard from "@/components/marketing/PropertyCard";
import { IPropertyCardProps } from "@/types/PropertyCardProps";
import React, { useEffect, useState } from "react";

const ExclusiveProperties = () => {
  const [properties, setProperties] = useState<IPropertyCardProps[]>([]);

  useEffect(() => {
    const fetchExclusive = async () => {
      try {
        const res = await fetch(
          "/api/home/featured?category=exclusive-projects&type=table"
        );
        const data = await res.json();

        if (data) {
          setProperties(data.properties);
        }
      } catch (error) {
        console.error("Error fetching High ROI properties:", error);
      }
    };

    fetchExclusive();
  }, []);

  if (properties.length === 0) return null;

  return (
    <section className="premium_property">
      <div className="container">
        <div className="heading_block">
          <h3 className="title">Exclusive Properties</h3>
        </div>
        <CarouselWrapper slidesToShow={3}>
          {properties.length > 0 &&
            properties.map((item: IPropertyCardProps) => (
              <div key={item._id} style={{ padding: "0 12px" }}>
                <PropertyCard item={item} />
              </div>
            ))}
        </CarouselWrapper>
      </div>
    </section>
  );
};

export default ExclusiveProperties;
