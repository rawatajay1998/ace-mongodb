import { BedDouble, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";

const PropertyCard = () => {
  return (
    <div className="property_card">
      <div className="image_area overflow-hidden">
        <span className="badge">Featured</span>
        <Image
          src={"/assets/images/home-banner.jpg"}
          width={200}
          height={200}
          alt=""
          className="w-full"
        />
        <div className="address">
          <MapPin size={16} />
          Dubai, Downtown
        </div>
      </div>
      <div className="body">
        <h4 className="property_name">Property Name</h4>
        <div className="amenity_row">
          <div className="amenity">
            <BedDouble />
            <span>Beds</span>2
          </div>
          <div className="amenity">
            <BedDouble />
            <span>Beds</span>2
          </div>
          <div className="amenity">
            <BedDouble />
            <span>Beds</span>2
          </div>
        </div>
        <div className="footer_row">
          <div className="agent">
            <Image
              src={"/assets/images/home-banner.jpg"}
              alt=""
              width={60}
              height={60}
            />
            <p className="name">Sailesh Ranjan</p>
          </div>
          <p className="view">View Property</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
