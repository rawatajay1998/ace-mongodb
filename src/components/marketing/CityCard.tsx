import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CityCard = () => {
  return (
    <div className="city_card">
      <div className="image">
        <Image
          src={"/assets/images/home-banner.jpg"}
          alt=""
          height={200}
          width={200}
        />
      </div>
      <div className="details">
        <h4 className="name">Property Name</h4>
        <p className="count">67+ Properties</p>
        <Link href={"/"} className="view">
          View More
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default CityCard;
