import ReadMoreText from "@/components/marketing/ReadMoreText";
import { Collapse } from "antd";
import Image from "next/image";
import { notFound } from "next/navigation";
import FloorPlanImage from "./FloorPlan";
import GalleryImage from "./GalleryImage";
import { Metadata } from "next";
import AmenitiesSection from "./AmenitiesSection";
import { CloudDownload, MoveRight } from "lucide-react";
import ImageBannerGrid from "./ImagebannerGrid";
import dynamic from "next/dynamic";
import MortgageCalculator from "./MortgageCalculator";
import Link from "next/link";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";

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

  const { property } = await res.json();

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
          <div className="banner_property_deatils pt-10 pb-4">
            {images.length > 0 && <ImageBannerGrid images={images} />}
          </div>
          <div className="property_single_row">
            <div className="content_left">
              <div className="property_meta">
                <div className="content_top">
                  <div className="details">
                    <p className="price">
                      <span>AED</span> {property.propertyPrice}
                    </p>
                    <h1>{property.projectName}</h1>
                    <p className="developer">{property.developerName}</p>
                  </div>
                  <div className="btn_wrapper">
                    <button className="brochuure_btn">
                      <CloudDownload />
                      Download Brochure
                    </button>

                    <ShareModal
                      url={`https://aceeliteproperties.com/properties/${slug}`}
                    />
                  </div>
                </div>
                <div className="content_bottom">
                  <div className="row">
                    <div className="block">
                      <div className="label">Property Category</div>
                      <div className="text">
                        {property.propertyCategoryName}
                      </div>
                    </div>
                    <div className="block">
                      <div className="label">Property Type</div>
                      <div className="text">{property.propertyTypeName}</div>
                    </div>
                    <div className="block">
                      <div className="label">Property Status</div>
                      <div className="text">{property.propertyStatusName}</div>
                    </div>
                    <div className="block">
                      <div className="label">Unit Type</div>
                      <div className="text">{property.unitType}</div>
                    </div>
                    <div className="block">
                      <div className="label">Size</div>
                      <div className="text">{property.areaSize} </div>
                    </div>
                    <div className="block">
                      <div className="label">Payment Plan:</div>
                      <div className="text"> 70/30 </div>
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
              <div className="content">
                <h3 className="title">Pricing</h3>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.pricingSection }}
                />
              </div>

              <div className="content">
                <h3 className="title"> Mortgage Calculator</h3>
                <MortgageCalculator />
              </div>

              <div className="content">
                <h3 className="title">Payment Plan</h3>
                <div className="payment_plan_row">
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/down-payment.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <h4 className="percent">20%</h4>
                    <div className="name">Down Payment</div>
                    <div className="time">On Booking Date</div>
                  </div>
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/under-construction.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <div className="percent">50%</div>
                    <div className="name">During Construction</div>
                    <div className="time">Easy Installments</div>
                  </div>
                  <div className="block">
                    <div className="icon">
                      <Image
                        src={"/assets/images/hand-over.png"}
                        width={40}
                        height={40}
                        alt="icon"
                      />
                    </div>
                    <div className="percent">30%</div>
                    <div className="name">On Handover</div>
                    <div className="time">100% Completion</div>
                  </div>
                </div>
              </div>
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
            <div className="contact_form">
              <Image
                src={"/assets/images/ace-logo-blue.png"}
                height={60}
                width={60}
                alt="Ace Elite Properties Logo"
              />
              <h4 className="title">Contact Our Experts</h4>
              <div className="contact_btns">
                <Link
                  href={"mailto:info@AceEliteProperties.com"}
                  className="email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.3 2.7H2.7A1.3 1.3 0 0 0 1.3 4v8a1.3 1.3 0 0 0 1.4 1.3h10.6a1.3 1.3 0 0 0 1.4-1.3V4a1.3 1.3 0 0 0-1.4-1.3zm0 2.6L8 8.7 2.7 5.3V4L8 7.3 13.3 4z"></path>
                    <path fill="none" d="M0 0h16v16H0z"></path>
                  </svg>
                </Link>
                <Link href={"tel:+971 55 526 6579"} className="call">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
                  </svg>
                </Link>
                <div className="whatsapp">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z"
                    ></path>
                  </svg>
                </div>
              </div>

              {relatedProperties.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">
                    Similar Properties
                  </h3>

                  {relatedProperties.map((property) => {
                    return (
                      <div
                        className="relaated_property_card"
                        key={property._id}
                      >
                        <Image
                          src={property.thumbnailImage}
                          alt={property.projectName}
                          height={100}
                          width={100}
                        />
                        <div className="details">
                          <h4 className="name"> {property.projectName}</h4>
                          <p className="price">
                            <span>AED</span> {property.propertyPrice}
                          </p>
                          <Link href={property.slug}>
                            View Property <MoveRight size={16} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
