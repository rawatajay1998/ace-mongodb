import { Star } from "lucide-react";
import React from "react";

const TestimonialCard = () => {
  return (
    <div className="testimonial__card">
      <div className="about">
        <div className="icon">
          <span>A</span>
        </div>
        <div className="details">
          <h4 className="name">Aisha K.</h4>
          <h5 className="profile"> Dubai Resident</h5>
        </div>
      </div>
      <div className="stars">
        <Star size={20} />
        <Star size={20} />
        <Star size={20} />
        <Star size={20} />
        <Star size={20} />
      </div>
      <div className="testimonial">
        <p>
          From my initial inquiry to the final handover, the service was
          top-notch. The agents were transparent, knowledgeable, and always
          available to answer my questions. I couldn’t have asked for a better
          experience in buying my new apartment.
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
