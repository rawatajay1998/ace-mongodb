import { Image } from "antd";
import React from "react";

interface GalleryImageProps {
  imageUrl: string;
}

const GalleryImage = ({ imageUrl }: GalleryImageProps) => {
  return <Image src={imageUrl} height={200} width={200} alt="Floor Plans" />;
};

export default GalleryImage;
