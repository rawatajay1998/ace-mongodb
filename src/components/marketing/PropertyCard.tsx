import { BedDouble, LandPlot, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IPropertyCardProps } from "@/types/PropertyCardProps";
import Link from "next/link";

const PropertyCard = ({ item }: { item: IPropertyCardProps }) => {
  return (
    <div className="property_card">
      <div className="image_area overflow-hidden">
        <span className="badge">Featured</span>
        <Image
          src={item.bannerImage}
          width={1000}
          height={1000}
          alt=""
          className="w-full"
          loading="lazy"
        />
        <div className="address">
          <MapPin size={16} />
          {item.areaName}, {item.cityName}
        </div>
      </div>
      <div className="body">
        <h4 className="property_name">{item.projectName}</h4>
        <div className="amenity_row">
          <div className="amenity">
            <BedDouble />
            {item.unitType}
          </div>
          <div className="amenity">
            <LandPlot />
            {item.areaSize}
          </div>
        </div>
        <div className="footer_row">
          <div className="agent">
            <Image
              src={
                item.postedBy.profileImageUrl ||
                "/assets/images/dummy-agent-image.png"
              }
              loading="lazy"
              alt={item.projectName}
              width={60}
              height={60}
            />
            <p className="name capitalize">
              {item.postedBy.name || "Unknown Agent"}
            </p>
          </div>
          <Link
            className="view"
            href={`/property/${encodeURIComponent(item.slug)}`}
          >
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
