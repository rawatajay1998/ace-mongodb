"use client";

import { IPropertyCardProps } from "@/types/PropertyCardProps";
import { Empty, Alert, Tooltip, Typography, Button } from "antd";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";

const { Text } = Typography;

export function PropertyListing({
  properties,
  error,
}: {
  properties: IPropertyCardProps[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  error: string | null;
}) {
  if (error) {
    return (
      <div className="text-center py-8">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty
        description={
          <Text type="secondary">
            No properties found matching your criteria
          </Text>
        }
        className="py-12"
      />
    );
  }

  return (
    <div className="grid listing_page_cards">
      {properties.map((property: IPropertyCardProps) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}

function PropertyCard({ property }: { property: IPropertyCardProps }) {
  return (
    <div className="card flex bg-white rounded-lg">
      <div className="image_area w-[250px] h-[250px] relative">
        <Image
          src={property?.thumbnailImage || "/no-image.jpg"}
          alt={property.projectName}
          fill
          className="object-cover rounded-sm"
          sizes="(max-width: 768px) 100vw, 250px" // Correct size declaration
          quality={100}
          priority
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div className="badge">{property.propertySubCategoryName}</div>

        <div className="header">
          <div>
            <Link href={`/property/${property.slug}`}>
              <h3 className="project_name">{property.projectName}</h3>
            </Link>
            <p className="flex items-center gap-2 location">
              <MapPin size={16} />
              <span>
                {property.cityName}, {property.areaName}
              </span>
            </p>
          </div>
        </div>

        <div className="body">
          <div className="property_details">
            <span>
              <strong>Unit Type:</strong>
              {property.unitType}
            </span>
            <span>
              <strong> Area Size:</strong>
              {property.areaSize}
            </span>
            <span>
              <strong>Property Type:</strong>
              {property.propertyTypeName}
            </span>
          </div>

          <div
            className="property_about"
            dangerouslySetInnerHTML={{
              __html: property.aboutProperty,
            }}
          ></div>
        </div>

        <div className="footer">
          <div className="contact_btns">
            <Tooltip title="Email">
              <Link href={"mailto:info@aceeliteproperties.com"}>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.3 2.7H2.7A1.3 1.3 0 0 0 1.3 4v8a1.3 1.3 0 0 0 1.4 1.3h10.6a1.3 1.3 0 0 0 1.4-1.3V4a1.3 1.3 0 0 0-1.4-1.3zm0 2.6L8 8.7 2.7 5.3V4L8 7.3 13.3 4z"></path>
                    <path fill="none" d="M0 0h16v16H0z"></path>
                  </svg>
                  <span> Email</span>
                </button>
              </Link>
            </Tooltip>
            <Tooltip title="Call">
              <Link href={"tel:+971555266579"}>
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
                  </svg>
                  <span> Phone</span>
                </button>
              </Link>
            </Tooltip>
            <Tooltip title="Whatsapp">
              <Link
                href={
                  "https://wa.me/971555266579?text=Hi%20Ace%20Elite%20Properties%2C%20I%27m%20interested%20in%20one%20of%20your%20property%20listings.%20Could%20you%20please%20share%20more%20details%3F"
                }
              >
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z"
                    ></path>
                  </svg>
                  <span> Whatsapp</span>
                </button>
              </Link>
            </Tooltip>
          </div>
          <Link href={`/property/${property.slug}`}>
            <button>View Property</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
