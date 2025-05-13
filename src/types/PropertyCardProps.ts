import { IFAQ } from "@/models/property.model";

export interface IPropertyCardProps extends Document {
  _id: string;
  projectName: string;
  propertyType: string;
  propertyStatus: string;
  propertyCategory: string;
  city: string;
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
    profileImage: string;
  };
  galleryImages: string[];
  about: string;
  locationAdvantages: string;
  pricingSection: string;
  amenities: string[];
  faqs: IFAQ[];
}
