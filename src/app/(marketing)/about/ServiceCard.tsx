// ServiceCards.tsx
"use client";

import Image from "next/image";

const services = [
  {
    title: "Residential Property",
    description:
      "Residential property services in Dubai encompass a range of offerings for managing, buying, selling, and leasing residential properties.",
    image: "/assets/images/residential.avif",
  },
  {
    title: "Commercial Property",
    description:
      "Dubai's commercial property market offers a wide range of services, from buying and leasing to property management and consulting.",
    image: "/assets/images/commercial.jpg",
  },
  {
    title: "Property Management",
    description:
      "Property management services in Dubai offer comprehensive support for landlords and owners to maximize rental returns.",
    image: "/assets/images/property-management.jpg",
  },
  {
    title: "Post Purchase Property",
    description:
      "Post-purchase services in Dubai include support offered to new property owners, often by developers or real estate agents.",
    image: "/assets/images/post-property.jpg",
  },
];

const ServiceCards = () => {
  return (
    <section>
      <ul className="gallery_list grid grid-cols-1 sm:grid-cols-4">
        {services.map((item) => {
          return (
            <>
              <li key={item.title} className="gallery_list-item">
                <a className="gallery_list-item_trigger">
                  <div className="img-wrapper">
                    <picture>
                      <Image
                        height={400}
                        width={400}
                        className="lazy entered loaded"
                        src={item.image}
                        style={{ objectFit: "cover" }}
                        alt={item.title}
                      />
                    </picture>
                  </div>
                  <div className="text-wrapper d-flex flex-column justify-content-end">
                    <span className="subtitle">Ace Elie Properties</span>
                    <h4 className="title">{item.title}</h4>
                    <span className="label">{item.description}</span>
                  </div>
                </a>
              </li>
            </>
          );
        })}
      </ul>
    </section>
  );
};

export default ServiceCards;
