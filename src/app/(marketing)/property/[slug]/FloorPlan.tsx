"use client";

import { Image } from "antd";
import React from "react";

interface FloorPlanImageProps {
  imageUrl: string;
}

const FloorPlanImage = ({ imageUrl }: FloorPlanImageProps) => {
  return (
    <Image
      loading="lazy"
      src={imageUrl}
      height={200}
      width={200}
      alt="Floor Plans"
    />
  );
};

export default FloorPlanImage;
