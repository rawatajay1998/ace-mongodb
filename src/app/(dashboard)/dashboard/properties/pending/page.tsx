// app/dashboard/properties/page.tsx
"use client";

import { useEffect, useState } from "react";

type Property = {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved";
};

export default function PendingPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentProperties = async () => {
      try {
        const res = await fetch("/api/properties/get/pending", {
          method: "GET",
          credentials: "include", // important to send cookies
        });

        const data = await res.json();
        setProperties(data.properties);
      } catch (error) {
        console.error("Failed to load agent properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentProperties();
  }, []);

  const approveProperty = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/approve/${propertyId}`, {
        method: "PATCH",
      });

      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error approving property:", error);
    }
  };

  if (loading) return <div>Loading your properties...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties &&
          properties.map((property) => (
            <div
              key={property._id}
              className="border rounded-md shadow-md p-4 bg-white"
            >
              <h2 className="text-lg font-bold mt-2">{property.title}</h2>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-green-700 font-semibold">₹ {property.price}</p>
              <p
                className={`text-xs font-medium mt-1 ${
                  property.status === "approved"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {/* {property.status.toUpperCase()} */}
              </p>
              <p className="text-sm mt-2">
                {property.description.slice(0, 100)}...
              </p>
              <button onClick={() => approveProperty(property._id)}>
                Approve
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
