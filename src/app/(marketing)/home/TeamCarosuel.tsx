"use client";

import TeamCard from "@/components/marketing/TeamCard";
import { Carousel } from "antd";
import { useEffect, useState } from "react";

const TeamSection = ({ teamArray }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(teamArray.length, 4)}, 1fr)`,
          justifyContent: teamArray.length < 4 ? "center" : "start",
          gap: "24px",
        }}
      >
        {teamArray.map((person) => (
          <TeamCard key={person.name} {...person} />
        ))}
      </div>
    );
  }

  return (
    <Carousel
      dots={false}
      infinite={false}
      slidesToShow={1} // default mobile
      responsive={[
        {
          breakpoint: 1024, // tablet
          settings: {
            slidesToShow: 1,
          },
        },
      ]}
    >
      {teamArray.map((person) => (
        <TeamCard key={person.name} {...person} />
      ))}
    </Carousel>
  );
};

export default TeamSection;
