"use client";

import { useState, useEffect } from "react";
import ReadMoreText from "@/components/marketing/ReadMoreText";
import { Collapse } from "antd";
import dynamic from "next/dynamic";
import ImageBannerGrid from "./ImagebannerGrid";
import PropertySkeleton from "./PageSkeleton";
import Image from "next/image";
import Link from "next/link";
const AmenitiesSection = dynamic(() => import("./AmenitiesSection"));
const MortgageCalculator = dynamic(() => import("./MortgageCalculator"));
const CarouselWrapper = dynamic(
  () => import("@/components/marketing/CarouselWrapper")
);
const FloorPlanImage = dynamic(() => import("./FloorPlan"));
const GalleryImage = dynamic(() => import("./GalleryImage"));
const SidebarPorperty = dynamic(() => import("./Sidebar"));
const DownloadBrochure = dynamic(() => import("./DownloadBrochure"));
const ShareModal = dynamic(() => import("./ShareModal"));
const PaymentPlanSection = dynamic(() => import("./PaymentPlansSection"));

export default function PropertyDetailsClient({
  property,
  relatedProperties,
  paymentPlans,
  slug,
}: {
  property;
  relatedProperties: [];
  paymentPlans;
  slug: string;
}) {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay or actual client side data loading if needed
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    // Render skeleton loader UI
    return <PropertySkeleton />;
  }

  // Prepare FAQ items
  const faqItems = property?.faqs?.map((faq, index: number) => ({
    key: String(index + 1),
    label: faq.question,
    children: <p>{faq.answer}</p>,
  }));

  const images = [property.bannerImage, ...(property.galleryImages || [])];

  console.log(property);

  return (
    <section className="property_content">
      <div className="container">
        <div className="banner_property_deatils pt-0 pb-4">
          {images.length > 0 && (
            <ImageBannerGrid
              bannerImage={property.bannerImage}
              images={images}
            />
          )}
        </div>
        <div className="property_single_row">
          <div className="content_left">
            <div className="property_meta">
              <div className="content_top">
                <div className="details">
                  <h1>{property.projectName}</h1>
                  <p className="developer">by {property.developerName}</p>

                  <p className="price">
                    <span>AED</span>{" "}
                    {Number(property.propertyPrice).toLocaleString()}
                  </p>
                </div>
                <div className="btn_wrapper flex-col">
                  <div className="flex item-center gap-4">
                    <DownloadBrochure propertyName={property.projectName} />

                    <ShareModal
                      url={`https://aceeliteproperties.com/property/${slug}`}
                    />
                  </div>
                  <div className="posted_by flex items-center gap-2 w-full justify-start lg:justify-end">
                    <p className="font-medium">Posted By:</p>
                    <Link
                      href={`/agents/${property.postedBy.slug}`}
                      className="flex items-center gap-2"
                    >
                      <Image
                        height={28}
                        width={28}
                        alt="Posted By Agent Profile Image"
                        src={property.postedBy.profileImageUrl}
                      />
                      <span className="font-medium">
                        {property.postedBy.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="content_bottom">
                <div className="row">
                  <div className="block">
                    <div className="label">Property Category:</div>
                    <div className="text">{property.propertyCategoryName}</div>
                  </div>
                  <div className="block">
                    <div className="label">Property Type:</div>
                    <div className="text">{property.propertyTypeName}</div>
                  </div>
                  <div className="block">
                    <div className="label">Property Status:</div>
                    <div className="text">{property.propertyStatusName}</div>
                  </div>
                  <div className="block">
                    <div className="label">Unit Type:</div>
                    <div className="text">{property.unitType}</div>
                  </div>
                  <div className="block">
                    <div className="label">Size:</div>
                    <div className="text">{property.areaSize} </div>
                  </div>
                  <div className="block">
                    <div className="label">Payment Plan:</div>
                    <div className="text"> {property.paymentPlan} </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <h3 className="title">Description</h3>
              <ReadMoreText text={property.aboutProperty} maxLength={400} />
            </div>
            <div className="content">
              <h3 className="title">Location Advantages</h3>
              <ReadMoreText
                text={property.locationAdvantages}
                maxLength={400}
              />
            </div>
            <div className="content">
              <h3 className="title">Amenities</h3>

              <AmenitiesSection amenities={property.amenities} />
            </div>
            <div className="content pricing_section">
              <h3 className="title">Pricing</h3>
              <div
                className="prose prose-sm max-w-none overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: property.pricingSection }}
              />
            </div>

            <div className="content">
              <h3 className="title"> Mortgage Calculator</h3>
              <MortgageCalculator />
            </div>

            <PaymentPlanSection paymentPlans={paymentPlans} />
            <div className="content">
              <h3 className="title">Floor Plans</h3>
              <CarouselWrapper slidesToShow={3}>
                {property.floorPlansImages &&
                  property.floorPlansImages.map((url: string) => {
                    return (
                      <div key={url}>
                        <FloorPlanImage imageUrl={url} />
                      </div>
                    );
                  })}
              </CarouselWrapper>
            </div>
            <div className="content">
              <h3 className="title">Gallery</h3>

              <CarouselWrapper slidesToShow={3}>
                {property.galleryImages &&
                  property.galleryImages.map((url: string) => {
                    return (
                      <div key={url}>
                        <GalleryImage imageUrl={url} />
                      </div>
                    );
                  })}
              </CarouselWrapper>
            </div>
            <div className="content">
              <h3 className="title">Frequently Asked Questions</h3>
              <Collapse items={faqItems} defaultActiveKey={["1"]} />
            </div>
          </div>
          <SidebarPorperty
            relatedProperties={relatedProperties}
            propertyName={property.projectName}
          />
        </div>
      </div>
    </section>
  );
}
