import { IFAQ } from "@/models/property.model";

export interface IPropertyCardProps extends Document {
  _id: string;
  projectName: string;
  propertyType: string;
  propertyStatus: string;
  propertyCategory: string;
  propertyTypeName: string;
  city: string;
  cityName: string;
  areaName: string;
  unitType: string;
  country: string;
  downPayment: string;
  handoverDate: string;
  areaSize: number;
  thumbnailImage: string;
  bannerImage: string;
  description: string;
  locality: string;
  bathrooms: number;
  beds: number;
  propertyPrice: number;
  verified: boolean;
  slug: string;
  postedBy: {
    name: string;
    profileImageUrl: string;
  };
  galleryImages: string[];
  aboutProperty: string;
  locationAdvantages: string;
  pricingSection: string;
  amenities: [];
  faqs: IFAQ[];
}
