import Image from "next/image";
import React from "react";

interface PersonProps {
  name: string;
  designation: string;
  imageUrl: string;
}

const TeamCard = ({ name, designation, imageUrl }: PersonProps) => {
  return (
    <div className="team_card">
      <div className="image">
        <Image src={imageUrl} alt="" height={500} width={500} />
      </div>
      <div className="about">
        <h4 className="name">{name}</h4>
        <p className="designation">{designation}</p>
      </div>
    </div>
  );
};

export default TeamCard;
