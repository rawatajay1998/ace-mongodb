import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <div className="about_page">
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
                src={"/assets/images/about-page-1.avif"}
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
