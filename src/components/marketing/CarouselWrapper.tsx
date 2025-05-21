"use client";
import React from "react";
import { Carousel } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArrowProps {
  className?: string;
  onClick?: () => void;
}

const PrevArrow = ({ className, onClick }: ArrowProps) => (
  <button className={className} onClick={onClick}>
    <ChevronLeft />
  </button>
);

const NextArrow = ({ className, onClick }: ArrowProps) => (
  <button className={className} onClick={onClick}>
    <ChevronRight />
  </button>
);

interface CarouselWrapperProps {
  children: React.ReactNode;
  slidesToShow: number;
}

const CarouselWrapper = ({ children, slidesToShow }: CarouselWrapperProps) => {
  return (
    <div className="carousel_wrapper">
      <Carousel
        arrows
        infinite={true}
        slidesToShow={slidesToShow}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 3,
            },
          },
        ]}
        slidesToScroll={1}
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CarouselWrapper;
