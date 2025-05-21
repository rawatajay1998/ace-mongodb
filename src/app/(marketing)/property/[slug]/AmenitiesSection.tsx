"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "antd"; // Using Ant Design for the modal (optional)

// Dummy amenity type
type Amenity = {
  _id: string;
  name: string;
  imageUrl: string;
};

type Props = {
  amenities: Amenity[];
};

export default function AmenitiesSection({ amenities }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showMore = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const visibleAmenities = amenities.slice(0, 5);
  const remainingAmenities = amenities.length - 1;

  return (
    <>
      <div className="amenity_row flex flex-wrap gap-4">
        {visibleAmenities.map((item) => (
          <div key={item._id} className="amenity flex items-center gap-2">
            <Image src={item.imageUrl} width={20} height={20} alt={item.name} />
            <h4>{item.name}</h4>
          </div>
        ))}

        {remainingAmenities > 0 && (
          <button
            className="text-blue-600 font-medium underline cursor-pointer"
            onClick={showMore}
          >
            + {remainingAmenities} more amenities
          </button>
        )}
      </div>

      <Modal
        title="All Amenities"
        open={isModalOpen}
        onCancel={hideModal}
        footer={null}
        centered
      >
        <div className="amenity_row">
          {amenities.map((item) => (
            <div key={item._id} className="amenity flex items-center gap-2">
              <Image
                src={item.imageUrl}
                width={20}
                height={20}
                alt={item.name}
              />
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
