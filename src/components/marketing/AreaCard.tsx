import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AreaCardProps {
  name: string;
  topLocation: boolean;
  featuredOnHomepage: boolean;
  propertyCount: number;
  areaImageUrl: string;
  slug: string;
}

const AreaCard = ({
  name,
  areaImageUrl,
  propertyCount,
  slug,
}: AreaCardProps) => {
  console.log(areaImageUrl);
  return (
    <div className="city_card border rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <div className="image w-full h-40 relative">
        <Image
          src={areaImageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="details p-4 bg-white">
        <h4 className="name text-lg font-semibold text-gray-800">{name}</h4>
        <p className="count text-sm text-gray-500 mb-2">
          {propertyCount}+ Properties
        </p>

        <Link
          href={`/search/${slug}`}
          className="view inline-flex items-center text-blue-600 hover:underline text-sm"
        >
          View Properties <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default AreaCard;
