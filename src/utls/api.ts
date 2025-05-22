import axios from "axios";
import toast from "react-hot-toast";

// Define API base URL if needed (optional)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Get Property by ID
export const getPropertyById = async (propertyId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    toast.error(error.message);
    throw new Error("Error fetching property data.");
  }
};

// Update Property
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProperty = async (propertyId: string, propertyData: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/properties/${propertyId}`,
      propertyData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating property data:", error);
    throw new Error("Error updating property data.");
  }
};
