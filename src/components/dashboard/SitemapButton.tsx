"use client";
import { useState } from "react";

export default function SitemapModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const generateSitemap = async () => {
    setStatus("Generating...");
    try {
      const res = await fetch("/api/generate-sitemap", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
      } else {
        setStatus(data.error || "Something went wrong");
      }
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Generate Sitemap
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Generate Sitemap</h2>
            <p className="mb-4 text-sm text-gray-600">
              This will regenerate your sitemap with the latest property and
              search data.
            </p>
            {status && (
              <div className="mb-3 text-sm text-blue-700">{status}</div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={generateSitemap}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
