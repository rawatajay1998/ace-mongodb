import Image from "next/image";
import React from "react";

const TeamCard = () => {
  return (
    <div className="team_card">
      <div className="image">
        <Image
          src={"/assets/images/team/rishi-malik.jpg"}
          alt=""
          height={500}
          width={500}
        />
      </div>
      <div className="about">
        <h4 className="name">Rishi Malik</h4>
        <p className="designation">Founder</p>
      </div>
    </div>
  );
};

export default TeamCard;
