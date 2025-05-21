"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MoveRight } from "lucide-react";
import { useState } from "react";
import { Modal } from "antd";
import ContactForm from "../../contact/ContactForm";

type Property = {
  _id: string;
  projectName: string;
  thumbnailImage: string;
  propertyPrice: string;
  slug: string;
};

type Props = {
  relatedProperties: Property[];
  propertyName: string;
};

const SidebarPorperty = ({ relatedProperties, propertyName }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="contact_form">
      <Image
        src={"/assets/images/ace-logo-blue.png"}
        height={60}
        width={60}
        alt="Ace Elite Properties Logo"
      />
      <h4 className="title">Contact Our Experts</h4>

      <div className="contact_btns">
        {/* <Link href={"mailto:info@AceEliteProperties.com"} className="email">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M13.3 2.7H2.7A1.3 1.3 0 0 0 1.3 4v8a1.3 1.3 0 0 0 1.4 1.3h10.6a1.3 1.3 0 0 0 1.4-1.3V4a1.3 1.3 0 0 0-1.4-1.3zm0 2.6L8 8.7 2.7 5.3V4L8 7.3 13.3 4z"></path>
            <path fill="none" d="M0 0h16v16H0z"></path>
          </svg>
        </Link> */}
        <Link href={"tel:+971 55 526 6579"} className="call">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M13.3 10.3A7.6 7.6 0 0 1 11 10a.7.7 0 0 0-.7.1l-1 1.4a10.1 10.1 0 0 1-4.6-4.6L6 5.7A.7.7 0 0 0 6 5a7.4 7.4 0 0 1-.3-2.3A.7.7 0 0 0 5 2H2.8c-.4 0-.8.2-.8.7A11.4 11.4 0 0 0 13.3 14a.7.7 0 0 0 .7-.8V11a.7.7 0 0 0-.7-.6z"></path>
          </svg>
          Call Now
        </Link>
        <div className="whatsapp">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M19.2 4.8A10.2 10.2 0 0 0 3.2 17l-1.4 5.3L7.2 21a10.1 10.1 0 0 0 4.8 1 10.2 10.2 0 0 0 7.2-17.3zM12 20.4a8.4 8.4 0 0 1-4.3-1.2h-.3l-3.2.7 1-3.1-.3-.3a8.4 8.4 0 1 1 7.1 4zm4.7-6.3c-.3-.1-1.5-.8-1.8-.8s-.4-.2-.5 0l-.8 1c-.1 0-.3.3-.6.2a7 7 0 0 1-2-1.3 7.7 7.7 0 0 1-1.4-1.8c-.2-.2 0-.4 0-.5l.5-.4a1.7 1.7 0 0 0 .2-.5.5.5 0 0 0 0-.4l-.8-2c-.2-.4-.4-.3-.6-.3h-.4a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-1 2A5 5 0 0 0 8 12.4a11.3 11.3 0 0 0 4.4 4 14.5 14.5 0 0 0 1.4.4 3.4 3.4 0 0 0 1.6 0 2.6 2.6 0 0 0 1.7-1 2.1 2.1 0 0 0 .2-1.3l-.5-.3z"
            ></path>
          </svg>
          Whatsapp
        </div>
      </div>

      {/* 👉 Button to open modal */}
      <div className="mt-4">
        <button className="contact_btn" onClick={() => setIsModalOpen(true)}>
          <span className="icon-advanced-email">
            <Mail size={18} />
          </span>
          Open Contact Form
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="contact_form">
          <ContactForm source="property" propertyName={propertyName} />
        </div>
      </Modal>

      {relatedProperties.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Similar Properties</h3>

          {relatedProperties.map((property) => (
            <div className="relaated_property_card" key={property._id}>
              <Image
                src={property.thumbnailImage}
                alt={property.projectName}
                height={100}
                width={100}
              />
              <div className="details">
                <h4 className="name">{property.projectName}</h4>
                <p className="price">
                  <span>AED</span> {property.propertyPrice}
                </p>
                <Link href={property.slug}>
                  View Property <MoveRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarPorperty;
