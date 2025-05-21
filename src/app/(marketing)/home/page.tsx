import React from "react";
import {
  Briefcase,
  Building2,
  Home,
  Landmark,
  Layout,
  MoveRight,
  Store,
} from "lucide-react";
import Image from "next/image";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import Link from "next/link";
import TeamCard from "@/components/marketing/TeamCard";

import SearchBanner from "./searchBanner";
import OffPlanProperties from "./OffPlan";
import SecondaryProperties from "./Secondary";
import RentalProperties from "./Rental";
import HighROIProperties from "./HIghROI";
import TopLocations from "./TopLocations";
import TestimonialsCarousel from "./Testimonials";
import DeveloperCarousel from "./Developers";

const teamArray = [
  {
    name: "Rishi Malik",
    designation: "Founder",
    imageUrl: "/assets/images/team/rishi-malik.jpg",
  },
  {
    name: "Rucile",
    designation: "Admin Officer",
    imageUrl: "/assets/images/team/rucile.jpg",
  },
  {
    name: "Mayuri Chandwani",
    designation: "RealEstate Agent",
    imageUrl: "/assets/images/team/mayuri-chadnwani.jpg",
  },
  {
    name: "Natalia",
    designation: "RealEstate Agent",
    imageUrl: "/assets/images/team/natalia-rashwan.jpg",
  },
  {
    name: "Christine",
    designation: "RealEstate Agent",
    imageUrl: "/assets/images/team/christine.jpg",
  },
];

const HomePgae = () => {
  return (
    <div className="home">
      <section className="banner_section">
        <div className="vide_container">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/assets/dubai-banner-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="container">
          <div className="content">
            <h1>Your Safe Path to Owning Properties in Dubai Starts Here </h1>
            <p>
              Verified properties. Honest advice. No fake promises just real
              opportunities in Dubai real estate.
            </p>
          </div>
          <div className="search_container">
            <div className="search_row">
              <SearchBanner />
            </div>

            <div className="details">
              <div className="icons_row">
                <div className="block">
                  <p>
                    <span>100+</span> Years Collective Experience
                  </p>
                </div>
                <div className="block">
                  <p>
                    <span>15+</span>Nationality in Sales team
                  </p>
                </div>
                <div className="block">
                  <p>
                    <span>40+</span>Listings
                  </p>
                </div>
                <div className="block">
                  <p>
                    <span>100+</span>Million Sales in 2024 Year
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="type_section">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Try Searching For</h3>
          </div>
          <div className="type_row">
            <Link href={`/search/dubai?propertyType=Apartment`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Building2 color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>Apartment</h4>
              </div>
            </Link>
            <Link href={`/search/dubai?propertyType=Villa`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Home color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>Villa</h4>
              </div>
            </Link>

            <Link href={`/search/dubai?propertyType=Studio`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Layout color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>Studio</h4>
              </div>
            </Link>
            <Link href={`/search/dubai?propertyType=Office`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Briefcase color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>Office</h4>
              </div>
            </Link>
            <Link href={`/search/dubai?propertyType=TownHouse`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Landmark color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>TownHouse</h4>
              </div>
            </Link>
            <Link href={`/search/dubai?propertyType=Commercial`} passHref>
              <div className="block cursor-pointer hover:opacity-80 transition">
                <Store color="#5c6368" strokeWidth={1.5} size={32} />
                <h4>Commercial</h4>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="services_section bg_section">
        <div className="container">
          <div className="grid_row">
            <div className="image">
              <Image
                src={"/assets/images/our-services.jpg"}
                alt="Home Banner"
                width={1200}
                height={1200}
              />
            </div>
            <div className="content_row">
              <div className="heading_block">
                <p> Our Services</p>
                <h3 className="title">Comfort is our priority for you</h3>
              </div>
              <div className="row">
                <div className="block">
                  <h4>Residential Property</h4>
                  <p>
                    Residential property services in Dubai encompass a range of
                    offerings for managing, buying, selling, and leasing
                    residential properties. These services include property
                    management, leasing, sales and marketing, and property
                    valuation.
                  </p>
                  <Link href={"/"}>
                    See More
                    <MoveRight size={20} />
                  </Link>
                </div>
                <div className="block">
                  <h4>Commercial Property</h4>
                  <p>
                    Dubai&apos;s commercial property market offers a wide range
                    of services, from buying and leasing to property management
                    and consulting. The market is characterized by a thriving
                    economy, favorable business environment
                  </p>
                  <Link href={"/"}>
                    See More
                    <MoveRight size={20} />
                  </Link>
                </div>
                <div className="block">
                  <h4>Property Management</h4>
                  <p>
                    Property management services in Dubai offer a comprehensive
                    range of support for landlords and property owners,
                    simplifying the process of managing rental properties and
                    maximizing returns.
                  </p>
                  <Link href={"/"}>
                    See More
                    <MoveRight size={20} />
                  </Link>
                </div>
                <div className="block">
                  <h4>Post Purchase Property</h4>
                  <p>
                    Post-purchase property services in Dubai include a range of
                    support offered to new property owners, often by developers
                    or real estate agents.
                  </p>
                  <Link href={"/"}>
                    See More
                    <MoveRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium_property">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Off Plan Properties</h3>
          </div>
          <OffPlanProperties />
        </div>
      </section>

      <section className="featured_property bg_section">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Secondary Properties</h3>
          </div>
          <SecondaryProperties />
        </div>
      </section>

      <section className="featured_property">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Rental Properties</h3>
          </div>
          <RentalProperties />
        </div>
      </section>

      <section className="cities_section bg_section">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Top Locations</h3>
          </div>
          <TopLocations />
          <Link href={`/search/dubai`} className="view__all">
            View All
            <MoveRight size={20} />
          </Link>
        </div>
      </section>

      <section className="featured_property">
        <div className="container">
          <div className="heading_block">
            <h3 className="title">Recommended High ROI Projects</h3>
          </div>
          <HighROIProperties />
        </div>
      </section>

      <section className="testimonial_section bg_section">
        <div className="container">
          <div className="heading_block">
            <p>What Clients Say</p>
            <h3 className="title">
              Hear What They Say About
              <br />
              Our Service and Commitment to Excellence
            </h3>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="team_section">
        <div className="container">
          <div className="heading_block">
            <p> Our Team</p>
            <h3 className="title">
              Your Property Journey <br />
              Guided by Experts
            </h3>
          </div>
          <CarouselWrapper slidesToShow={5}>
            {teamArray &&
              teamArray.map((person) => {
                return <TeamCard key={person.name} {...person} />;
              })}
          </CarouselWrapper>
        </div>
      </section>

      <section className="team_section bg_section">
        <div className="container">
          <div className="heading_block" style={{ marginBottom: "0px" }}>
            <h3 className="title">Our Partners</h3>
          </div>
          <DeveloperCarousel />
        </div>
      </section>
    </div>
  );
};

export default HomePgae;
