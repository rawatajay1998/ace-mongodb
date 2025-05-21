import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import ServiceCard from "./ServiceCard";
import { ArrowRight } from "lucide-react";

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
      <section className="about_section">
        <div className="container">
          <div className="grid_row">
            <div className="image">
              <Image
                src={"/assets/images/about-one.jpg"}
                height={300}
                width={300}
                alt="Who We Are"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </div>
            <div className="content">
              <p className="pre_heading">
                <span></span> WHO WE ARE
              </p>
              <h3>
                Building <span>Trust & Excellence</span> in Dubai’s Real Estate
                Market
              </h3>
              <p>
                At Ace Elite Properties, we blend deep market knowledge with a
                client-first approach, helping buyers, sellers, and investors
                navigate Dubai’s fast-moving real estate sector.
              </p>
              <ul>
                <li>
                  <ArrowRight />
                  <span>Experienced Dubai-based consultants</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Unmatched market insights</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Reliable and transparent guidance</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Proven track record of client satisfaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ServiceCard />

      <section className="about_section">
        <div className="container">
          <div className="grid_row">
            <div className="content">
              <p className="pre_heading">
                <span></span> WHAT WE DO
              </p>
              <h3>
                Delivering <span>Tailored Real Estate</span> Solutions
              </h3>
              <p>
                From off-plan opportunities to ready properties and investment
                guidance, we provide end-to-end support for every real estate
                need in Dubai.
              </p>
              <ul>
                <li>
                  <ArrowRight />
                  <span>
                    Buy, Sell & Lease Residential and Commercial Properties
                  </span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Off-plan advisory with top developers</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Property management services</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Dedicated investor support team</span>
                </li>
              </ul>
            </div>
            <div className="image">
              <Image
                src={"/assets/images/about-two.jpg"}
                height={300}
                width={300}
                alt="Who We Are"
                style={{ maxHeight: "500px", objectFit: "cover" }}
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
                src={"/assets/images/about-three.avif"}
                height={300}
                width={300}
                alt="Why Choose Us"
                style={{ maxHeight: "500px", objectFit: "cover" }}
              />
            </div>
            <div className="content">
              <p className="pre_heading">
                <span></span> WHY CHOOSE US
              </p>
              <h3>
                Your <span>Trusted Partner</span> in Every Property Move
              </h3>
              <p>
                With Ace Elite Properties, you&apos;re not just working with
                agents — you&apos;re partnering with professionals who
                prioritize your success and satisfaction.
              </p>
              <ul>
                <li>
                  <ArrowRight />
                  <span>Personalized service for each client</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Strategic property matching</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Strong relationships with developers</span>
                </li>
                <li>
                  <ArrowRight />
                  <span>Support for both local and overseas investors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
