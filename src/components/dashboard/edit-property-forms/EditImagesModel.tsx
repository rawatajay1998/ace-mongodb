// components/EditImagesModal.tsx
"use client";

import { Modal, Upload, Tabs, Space, Image, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface EditImagesModalProps {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
}

const tabs = [
  { key: "thumbnailImage", label: "Thumbnail" },
  { key: "bannerImage", label: "Banner" },
  { key: "galleryImages", label: "Gallery" },
  { key: "floorPlansImages", label: "Floor Plans" },
] as const;

type ImageKey = (typeof tabs)[number]["key"];

export default function EditImagesModal({
  visible,
  onClose,
  slug,
}: EditImagesModalProps) {
  const [images, setImages] = useState<Record<ImageKey, string[]>>({
    thumbnailImage: [],
    bannerImage: [],
    galleryImages: [],
    floorPlansImages: [],
  });
  const [uploadingKey, setUploadingKey] = useState<ImageKey | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`/api/property/edit/images?slug=${slug}`);
        const { thumbnailImage, bannerImage, galleryImages, floorPlansImages } =
          res.data.property;
        setImages({
          thumbnailImage: [thumbnailImage],
          bannerImage: [bannerImage],
          galleryImages,
          floorPlansImages,
        });
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (visible) fetchImages();
  }, [slug, visible]);

  const handleDelete = async (key: ImageKey, url: string) => {
    try {
      await axios.delete(`/api/property/edit/images`, {
        data: { slug, key, url },
      });

      setImages((prev) => ({
        ...prev,
        [key]: prev[key].filter((img) => img !== url),
      }));

      toast.success("Image deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpload = async (key: ImageKey, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    formData.append("slug", slug);

    try {
      setUploadingKey(key);
      const res = await axios.post(`/api/property/edit/images`, formData);
      const url = res.data.url;

      setImages((prev) => ({
        ...prev,
        [key]:
          key === "thumbnailImage" || key === "bannerImage"
            ? [url]
            : [...prev[key], url],
      }));

      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingKey(null);
    }
  };

  const renderSection = (key: ImageKey) => {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Upload Placeholder Box */}
        <Upload
          multiple={key === "galleryImages" || key === "floorPlansImages"}
          beforeUpload={(file) => {
            handleUpload(key, file);
            return false; // Prevent default upload
          }}
          showUploadList={false}
          customRequest={({ file, onSuccess }) => {
            handleUpload(key, file as File).then(() => {
              onSuccess?.("ok"); // To satisfy Ant Design
            });
          }}
        >
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
            <span className="text-gray-500 text-sm">
              Click or Drag to Upload
            </span>
            <span className="text-xs text-gray-400 mt-1 capitalize">{key}</span>
            {uploadingKey === key && (
              <span className="text-xs text-blue-500 mt-2">Uploading...</span>
            )}
          </div>
        </Upload>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images[key]?.map((url) => (
            <div
              key={url}
              className="relative group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={url}
                alt={key}
                width={100}
                height={100}
                style={{ width: "100%" }}
                className="w-full h-12 object-cover rounded-xl"
              />

              {key !== "thumbnailImage" && key !== "bannerImage" && (
                <Popconfirm
                  title="Delete this image?"
                  onConfirm={() => handleDelete(key, url)}
                >
                  <button className="absolute top-2 right-2 w-7 h-7 bg-white text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </Popconfirm>
              )}
            </div>
          ))}
        </div>
      </Space>
    );
  };

  return (
    <Modal
      className="image_upload_modal"
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Edit Property Images"
      width={800}
      destroyOnClose
    >
      <Tabs
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          children: renderSection(tab.key),
        }))}
      />
    </Modal>
  );
}
