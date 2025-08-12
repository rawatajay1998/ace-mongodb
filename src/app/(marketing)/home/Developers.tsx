"use client";
import React from "react";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import Image from "next/image";

const DeveloperCarousel: React.FC = () => {
  const carouselRef = React.useRef<CarouselRef>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.next();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Carousel
        slidesToShow={6}
        autoplay={true}
        dots={true}
        infinite={true}
        responsive={[
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 480, settings: { slidesToShow: 2 } },
        ]}
      >
        {[
          "Azizi",
          "Binghatti",
          "damac",
          "alum",
          "luxuryrealties",
          "Ellington",
          "emaar",
          "imtiaz",
          "majid",
          "samana",
          "sobha",
        ].map((developer) => (
          <div key={developer} style={{ padding: "0 10px" }}>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                height: "100px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Image
                src={`/assets/images/developers/${developer}.png`}
                alt={`${developer} Logo`}
                height={developer === "luxuryrealties" ? 80 : 80}
                width={developer === "luxuryrealties" ? 160 : 180}
                style={{
                  objectFit: "contain",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight:
                    developer.toLowerCase() === "alum"
                      ? "60px"
                      : developer === "luxuryrealties"
                        ? "80px"
                        : "100px",
                }}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DeveloperCarousel;
