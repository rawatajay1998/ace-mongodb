"use client";
import { useState } from "react";
import { Modal, Image } from "antd";

const PropertyImageGallery = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState(false);

  if (!images?.length) return null;

  const isCompact = images.length < 4;

  return (
    <>
      {isCompact ? (
        <div className="relative w-full">
          <Image
            src={images[0]}
            alt="Main"
            width="100%"
            style={{ objectFit: "cover", borderRadius: 8 }}
            preview={false}
            className="image_large"
          />
          <button
            className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setOpen(true)}
          >
            View More
          </button>
        </div>
      ) : (
        <div className="flex gap-4 image_area">
          {/* Left Large Image */}
          <div className="flex-1">
            <Image
              src={images[0]}
              alt="Main"
              width="100%"
              className="image_large"
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
          </div>

          {/* Right Two Stacked Images */}
          <div className="w-1/3 flex flex-col gap-4">
            {images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="relative"
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={img}
                  alt={`Side ${i}`}
                  width="100%"
                  className="image_small"
                  style={{ objectFit: "cover" }}
                  preview={false}
                />
                {i === 1 && (
                  <button
                    className="view_more_button"
                    onClick={() => setOpen(true)}
                  >
                    View More
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Gallery */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
      >
        <Image.PreviewGroup>
          <div className="grid grid-cols-2 gap-2 p-4">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Preview ${index}`}
                width="100%"
                style={{ borderRadius: 6 }}
              />
            ))}
          </div>
        </Image.PreviewGroup>
      </Modal>
    </>
  );
};

export default PropertyImageGallery;
