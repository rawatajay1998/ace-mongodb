"use client";

import CarouselWrapper from "@/components/marketing/CarouselWrapper";
import TestimonialCard from "@/components/marketing/Testimonial";

const testimonials = [
  {
    name: "Michael R.",
    profile: "Investor",
    message:
      "I had an amazing experience purchasing an off-plan property through this platform. The team guided me through every step, provided detailed insights, and ensured a smooth transaction. Highly recommended for anyone looking to invest in Dubai real estate!",
  },
  {
    name: "Sarah L.",
    profile: "Homeowner",
    message:
      "After searching for months, I finally found the perfect villa thanks to this website. The listings were up-to-date, and the agents were extremely helpful. They understood my requirements and made the entire process stress-free.",
  },
  {
    name: "James T.",
    profile: "Real Estate Investor",
    message:
      "As a first-time investor in Dubai, I was unsure about the market. The team not only provided great property options but also gave me valuable advice on ROI and future growth potential. Their expertise made all the difference!",
  },
  {
    name: "Aisha K.",
    profile: "Dubai Resident",
    message:
      "From my initial inquiry to the final handover, the service was top-notch. The agents were transparent, knowledgeable, and always available to answer my questions. I couldn’t have asked for a better experience in buying my new apartment.",
  },
];

const TestimonialsCarousel = () => {
  return (
    <div>
      <CarouselWrapper slidesToShow={3}>
        {testimonials.map((t, i) => (
          <div key={i} className="px-4">
            <TestimonialCard
              name={t.name}
              profile={t.profile}
              message={t.message}
            />
          </div>
        ))}
      </CarouselWrapper>
    </div>
  );
};

export default TestimonialsCarousel;
