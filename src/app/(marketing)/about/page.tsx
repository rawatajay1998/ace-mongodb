import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About | Ace Elite Properties",
  description: "Discover amazing properties with our real estate platform",
  openGraph: {
    title: "About | Ace Elite Properties",
    description: "Discover amazing properties with our real estate platform",
    url: "https://aceeliteproperties.com",
    siteName: "Ace Elite Properties",
    images: [
      {
        url: "https://aceeliteproperties.com//assets/images/banner-image.webp",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Ace Elite Properties",
    description: "Discover amazing properties with our real estate platform",
    images: ["https://aceeliteproperties.com//assets/images/banner-image.webp"],
  },
};

const AboutPage = () => {
  return (
    <div className="about_page">
      <section className="banner_about">
        <div className="container">
          <div className="flex_row">
            <div className="box_left">
              <p>Become Partners</p>
              <h3>
                List your Properties on Ace Elite Properties, join Us Now!
              </h3>
              <Link href={"/contact"}>Become a Agent</Link>
            </div>
            <div className="box_right">
              <Image
                alt="image"
                loading="lazy"
                width="748"
                height="380"
                decoding="async"
                data-nimg="1"
                src="/assets/images/banner-about.png"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="about_section">
        <div className="container">
          <div className="grid_row">
            <div className="image">
              <Image
                src={"/assets/images/about-two.jpg"}
                height={300}
                width={300}
                alt="about us"
              />
            </div>
            <div className="content">
              <h3>Who We Are</h3>
              <p>
                Founded with a passion for real estate and a commitment to
                excellence, Ace Elite Properties has grown into a trusted name
                in Dubai’s dynamic property market.
              </p>
              <p>
                Our team consists of experienced real estate professionals who
                are deeply familiar with the local landscape, regulatory
                environment, and evolving investor demands.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="about_section">
        <div className="container">
          <div className="grid_row">
            <div className="content">
              <h3>What We Offer</h3>
              <ul>
                <li>
                  Off-Plan Projects from top developers including Emaar, Damac,
                  Sobha, Nakheel, and more
                </li>
                <li>
                  Ready-to-Move-In Properties across Dubai’s prime neighborhoods
                </li>
                <li>Luxury Villas, Apartments, Townhouses & Penthouses</li>
                <li>Commercial Spaces for business owners and investors</li>

                <li>
                  End-to-End Consultation — from selection and viewing to
                  documentation and handover
                </li>
                <li>
                  Support for International Buyers, including remote
                  transactions and property management
                </li>
              </ul>
            </div>
            <div className="image">
              <Image
                src={"/assets/images/about-one.jpg"}
                height={300}
                width={300}
                alt="about us"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="about_section">
        <div className="container">
          <div className="grid_row">
            <div className="image">
              <Image
                src={"/assets/images/about-page-1.avif"}
                height={300}
                width={300}
                alt="about us"
              />
            </div>
            <div className="content">
              <h3>Why Choose Ace Elite Properties?</h3>
              <ul>
                <li>Local Expertise with Global Reach</li>
                <li>Personalized Property Matching</li>
                <li>Transparent and Ethical Dealings</li>
                <li>Strong Developer Relationships</li>
                <li>Multilingual Team Support</li>
                <li>Client-Centric Approach</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
