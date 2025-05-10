import React from "react";
import { Tabs } from "antd";
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
import CityCard from "@/components/marketing/CityCard";
import Link from "next/link";
import TeamCard from "@/components/marketing/TeamCard";
import TestimonialCard from "@/components/marketing/Testimonial";

import SearchBanner from "./searchBanner";
import FeaturedProperties from "./FeaturedCategories";
import PremiumProperties from "./PremiumCategories";

const cities = [
  {
    city: "Downtown Dubai",
    count: 125,
    imageUrl: "/assets/images/downtown-dubai.jpg",
  },
  {
    city: "Dubai Marina",
    count: 98,
    imageUrl: "/assets/images/dubai-marina.jpg",
  },
  {
    city: "Palm Jumeirah",
    count: 74,
    imageUrl: "/assets/images/dubai-palm.jpeg",
  },
];

const teamArray = [
  {
    name: "Rishi Malik",
    designation: "Founder",
    imageUrl: "/assets/images/team/rishi-malik.jpg",
  },
  {
    name: "Fahad Rahim Khan",
    designation: "Human Resource",
    imageUrl: "/assets/images/team/fahad-rahim-khan.jpg",
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
        <div className="image_left">
          <Image
            src={"/assets/images/graplic-slider-2.png"}
            alt="Image"
            height={400}
            width={400}
          />
        </div>
        <div className="container">
          <div className="content">
            <h1>Reality Properties solve your problems</h1>
            <p>
              We are a real estate agency that will help you find the best{" "}
              <br />
              residence you dream of.
            </p>
          </div>
          <div className="search_row">
            <Tabs
              type="card"
              items={[
                { label: "Buy", key: "1", children: "" },
                { label: "Rent", key: "2", children: "" },
              ]}
            />

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
        <div className="image_right">
          <Image
            src={"/assets/images/home-banner.jpg"}
            alt="Home Banner"
            width={1200}
            height={1200}
          />
        </div>
      </section>

      <section className="type_section">
        <div className="container">
          <div className="heading_block">
            <p> Property Type</p>
            <h3 className="title">Try Searching For</h3>
          </div>
          <div className="type_row">
            <div className="block">
              <Building2 color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>Apartment</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Home color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>Villa</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Layout color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>Studio</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Briefcase color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>Office</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Landmark color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>TownHouse</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Store color="#5c6368" strokeWidth={1.5} size={32} />
              <h4>Commercial</h4>
              <p className="count">24 Property</p>
            </div>
          </div>
        </div>
      </section>

      <section className="services_section">
        <div className="container">
          <div className="grid_row">
            <div className="image">
              <Image
                src={"/assets/images/home-banner.jpg"}
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
            <p> Premium Properties</p>
            <h3 className="title">
              Discover Ace Elite Finest <br /> Properties for Your Dream Home
            </h3>
          </div>
          <PremiumProperties />
        </div>
      </section>

      <section className="cities_section">
        <div className="container">
          <div className="heading_block">
            <p> Explore Cities</p>
            <h3 className="title">Property Locations for Higher ROI</h3>
          </div>
          <div className="city_row">
            {cities.map((cityData) => (
              <CityCard key={cityData.city} {...cityData} />
            ))}
          </div>
          <Link href="/" className="view__all">
            View All
            <MoveRight size={20} />
          </Link>
        </div>
      </section>

      <section className="featured_property">
        <div className="container">
          <div className="heading_block">
            <p> Featured Properties</p>
            <h3 className="title">
              Discover Ace Elite Finest <br /> Properties for Your Dream Home
            </h3>
          </div>
          <FeaturedProperties />
        </div>
      </section>

      <section className="testimonial_section">
        <div className="container">
          <div className="heading_block">
            <p>What Clinets Say</p>
            <h3 className="title">
              Hear What They Say About
              <br />
              Our Service and Commitment to Excellence
            </h3>
          </div>
          <CarouselWrapper slidesToShow={3}>
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
            <TestimonialCard />
          </CarouselWrapper>
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
    </div>
  );
};

export default HomePgae;
