"use client";

import TeamCard from "@/components/marketing/TeamCard";
import { Carousel } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface ArrowProps {
  className?: string;
  onClick?: () => void;
}

const PrevArrow = ({ className, onClick }: ArrowProps) => (
  <button
    className={`${className} custom-prev`}
    onClick={onClick}
    aria-label="Previous"
  >
    <ChevronLeft />
  </button>
);

const NextArrow = ({ className, onClick }: ArrowProps) => (
  <button
    className={`${className} custom-next`}
    onClick={onClick}
    aria-label="Next"
  >
    <ChevronRight />
  </button>
);

const TeamSection = ({ teamArray }) => {
  const carouselSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024, // below 1024px
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative">
      <Carousel {...carouselSettings}>
        {teamArray.map((person) => (
          <TeamCard key={person.name} {...person} />
        ))}
      </Carousel>
    </div>
  );
};

export default TeamSection;
