import ReadMoreText from "@/components/marketing/ReadMoreText";
import { Collapse } from "antd";
import { notFound } from "next/navigation";
import FloorPlanImage from "./FloorPlan";
import GalleryImage from "./GalleryImage";
import { Metadata } from "next";
import AmenitiesSection from "./AmenitiesSection";
import ImageBannerGrid from "./ImagebannerGrid";
import dynamic from "next/dynamic";
import MortgageCalculator from "./MortgageCalculator";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import SidebarPorperty from "./Sidebar";
import DownloadBrochure from "./DownloadBrochure";
import axios from "axios";
import PaymentPlanSection from "../PaymentPlansSection";

const ShareModal = dynamic(() => import("./ShareModal"));

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  // Fetch property data (same as your page component)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/property/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Property Not Found",
      description: "The property you're looking for doesn't exist",
    };
  }

  const { property } = await res.json();

  return {
    title: `${property.projectName} | Ace Elite Properties`,
    description: property?.aboutProperty.substring(0, 160), // First 160 chars for meta description
    openGraph: {
      title: `${property.projectName} | Ace Elite Properties`,
      description: property?.aboutProperty.substring(0, 160),
      url: `https://aceeliteproperties.com/properties/${slug}`,
      siteName: "Ace Elite Properties",
      images: [
        {
          url:
            property.galleryImages?.[0] ||
            "/assets/images/default-property.jpg",
          width: 1200,
          height: 630,
          alt: property.projectName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.projectName} | Ace Elite Properties`,
      description: property?.aboutProperty.substring(0, 160),
      images: [
        property.galleryImages?.[0] || "/assets/images/default-property.jpg",
      ],
    },
    alternates: {
      canonical: `https://aceeliteproperties.com/properties/${slug}`,
    },
  };
}

type FAQ = {
  question: string;
  answer: string;
  _id: string;
};

export default async function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/property/${slug}`,
    {
      cache: "no-store", // disable caching to always get fresh data
    }
  );

  const { property } = await res.json();

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-plan`,
    {
      params: {
        search: property.projectName,
      },
    }
  );

  if (!res.ok) {
    notFound();
  }

  const relatedRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/property/related/${slug}`,
    { cache: "no-store" }
  );

  const relatedProperties = relatedRes.ok
    ? (await relatedRes.json()).relatedProperties
    : [];

  const images: string[] = [
    property.bannerImage,
    ...(property.galleryImages || []),
  ];

  //set faqs in accordion
  const faqItems =
    property &&
    property.faqs.map((faq: FAQ, index: number) => ({
      key: String(index + 1),
      label: faq.question,
      children: <p>{faq.answer}</p>,
    }));

  return (
    <>
      <section className="property_content">
        <div className="container">
          <div className="banner_property_deatils pt-0 pb-4">
            {images.length > 0 && <ImageBannerGrid images={images} />}
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
                  <div className="btn_wrapper">
                    <DownloadBrochure propertyName={property.projectName} />

                    <ShareModal
                      url={`https://aceeliteproperties.com/properties/${slug}`}
                    />
                  </div>
                </div>
                <div className="content_bottom">
                  <div className="row">
                    <div className="block">
                      <div className="label">Property Category:</div>
                      <div className="text">
                        {property.propertyCategoryName}
                      </div>
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

              <PaymentPlanSection paymentPlans={data.paymentPlans} />
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
    </>
  );
}
