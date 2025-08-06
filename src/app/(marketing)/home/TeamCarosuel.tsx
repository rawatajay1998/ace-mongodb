"use client";

import TeamCard from "@/components/marketing/TeamCard";
import { Carousel } from "antd";

const TeamSection = ({ teamArray }) => {
  const carouselSettings = {
    dots: false,
    infinite: false,
    slidesToShow: 5,
    margin: 10, // default is 5 (desktop)
    stagePadding: 10,
    responsive: [
      {
        breakpoint: 1024, // below 1024px
        settings: {
          slidesToShow: 1, // show 1 item for mobile
        },
      },
    ],
  };

  return (
    <Carousel {...carouselSettings}>
      {teamArray.map((person) => (
        <TeamCard key={person.name} {...person} />
      ))}
    </Carousel>
  );
};

export default TeamSection;
