// components/CloudinaryUploader.tsx
"use client";

import React, { useState } from "react";

type Props = {
  onUpload: (url: string) => void;
};

const CloudinaryUploader: React.FC<Props> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // ⚠️ Use your actual preset

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // Replace this too
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CloudinaryUploader;
