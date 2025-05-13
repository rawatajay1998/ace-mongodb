import { Star } from "lucide-react";
import React from "react";

interface TestimonialCardProps {
  name: string;
  profile: string;
  message: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  profile,
  message,
}) => {
  return (
    <div className="testimonial__card">
      <div className="about">
        <div className="icon">
          <span>{name.charAt(0)}</span>
        </div>
        <div className="details">
          <h4 className="name">{name}</h4>
          <h5 className="profile">{profile}</h5>
        </div>
      </div>
      <div className="stars">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star key={i} size={20} />
          ))}
      </div>
      <div className="testimonial">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
