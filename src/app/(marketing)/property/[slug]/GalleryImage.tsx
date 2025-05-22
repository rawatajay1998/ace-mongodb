"use client";

import { Image } from "antd";
import React from "react";

interface GalleryImageProps {
  imageUrl: string;
}

const GalleryImage = ({ imageUrl }: GalleryImageProps) => {
  return (
    <Image
      loading="lazy"
      src={imageUrl}
      height={200}
      width={400}
      alt="Floor Plans"
    />
  );
};

export default GalleryImage;
