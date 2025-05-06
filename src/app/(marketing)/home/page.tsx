"use client";

import React, { useState } from "react";
import { Button, Checkbox, Input, Select, Slider, Tabs } from "antd";
import {
  Briefcase,
  Building2,
  Home,
  Landmark,
  Layout,
  MoveRight,
  Search,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import Image from "next/image";
import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import PropertyCard from "@/components/marketing/PropertyCard";
import CityCard from "@/components/marketing/CityCard";
import Link from "next/link";
import TeamCard from "@/components/marketing/TeamCard";
import TestimonialCard from "@/components/marketing/Testimonial";

const HomePgae = () => {
  const [size, setSize] = useState<number[]>([500, 1000]);
  const [price, setPrice] = useState<number[]>([10000, 1000000]);

  const [openFilters, setOpenFilters] = useState(false);

  const amenities = [
    "Air Condition",
    "Disabled Access",
    "Floor",
    "Heating",
    "Renovation",
    "Window Type",
    "Cable TV",
    "Elevator",
    "Furnishing",
    "Intercom",
    "Security",
    "Search Property",
    "Ceiling Height",
    "Fence",
    "Garage",
    "Parking",
    "Swimming Pool",
    "Fireplace",
    "Garden",
    "Pet Friendly",
    "WiFi",
    "Construction Year",
  ];

  const onChangeSize = (newValue: number[]) => {
    setSize(newValue);
  };
  const onChangePrice = (newValue: number[]) => {
    setPrice(newValue);
  };

  return (
    <div className="home">
      <section className="banner_section">
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
                {
                  label: "Buy",
                  key: "1",
                  children: "",
                },
                {
                  label: "Rent",
                  key: "2",
                  children: "",
                },
              ]}
            />
            <div className="search_form">
              <form action="">
                <div className="form_field">
                  <label>Type</label>
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    options={[
                      {
                        value: "1",
                        label: "Not Identified",
                      },
                      {
                        value: "2",
                        label: "Closed",
                      },
                      {
                        value: "3",
                        label: "Communicated",
                      },
                      {
                        value: "4",
                        label: "Identified",
                      },
                      {
                        value: "5",
                        label: "Resolved",
                      },
                      {
                        value: "6",
                        label: "Cancelled",
                      },
                    ]}
                  />
                </div>
                <div className="form_field">
                  <label>Location</label>
                  <Input placeholder="Search Location" type="text" />
                </div>
                <div className="form_field">
                  <label>Keyword</label>
                  <Input placeholder="Search Keyword" type="text" />
                </div>
                <button
                  className="filter_btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFilters(!openFilters);
                  }}
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <button className="search_btn">
                  <Search size={16} />
                  Search
                </button>
              </form>
              {openFilters && (
                <div className="filters_dropdown">
                  <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium">
                          Price Range: {price[0]} - {price[1]}
                        </label>
                        <Slider
                          onChange={onChangePrice}
                          range
                          value={price}
                          min={0}
                          max={20000000}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">
                          Size Range (sqft): {size[0]} - {size[1]}
                        </label>
                        <Slider
                          onChange={onChangeSize}
                          range
                          min={0}
                          value={size}
                          max={3000}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select
                        placeholder="Rooms"
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                      </Select>

                      <Select
                        placeholder="Bathrooms"
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                      </Select>

                      <Select
                        placeholder="Bedrooms"
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="2">2</Select.Option>
                      </Select>

                      <Select
                        placeholder="Type"
                        className="w-full"
                        size="large"
                      >
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="apartment">
                          Apartment
                        </Select.Option>
                        <Select.Option value="villa">Villa</Select.Option>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-4 font-medium">
                        Amenities:
                      </label>
                      <Checkbox.Group className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {amenities.map((item) => (
                          <Checkbox key={item} value={item}>
                            {item}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="default">Reset</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
              <Home size={32} />
              <h4>Villa</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Layout size={32} />
              <h4>Studio</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Briefcase size={32} />
              <h4>Office</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Landmark />
              <h4>TownHouse</h4>
              <p className="count">24 Property</p>
            </div>
            <div className="block">
              <Store size={32} />
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
                    Dubai's commercial property market offers a wide range of
                    services, from buying and leasing to property management and
                    consulting. The market is characterized by a thriving
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
          <CarouselWrapper slidesToShow={3}>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
          </CarouselWrapper>
        </div>
      </section>

      <section className="cities_section">
        <div className="container">
          <div className="heading_block">
            <p> Explore Cities</p>
            <h3 className="title">Properties By Cities</h3>
          </div>
          <div className="city_row">
            <CityCard />
            <CityCard />
            <CityCard />
            <CityCard />
            <CityCard />
            <CityCard />
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
          <CarouselWrapper slidesToShow={3}>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
            <div style={{ padding: "0 12px" }}>
              <PropertyCard />
            </div>
          </CarouselWrapper>
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
            <TeamCard />
            <TeamCard />
            <TeamCard />
            <TeamCard />
          </CarouselWrapper>
        </div>
      </section>
    </div>
  );
};

export default HomePgae;
