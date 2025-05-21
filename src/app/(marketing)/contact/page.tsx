import { Check } from "lucide-react";
import ContactForm from "./ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact  | Ace Elite Properties",
  description: "Discover amazing properties with our real estate platform",
  openGraph: {
    title: "Contact  | Ace Elite Properties",
    description: "Discover amazing properties with our real estate platform",
    url: "https://aceeliteproperties.com",
    siteName: "Ace Elite Properties",
    images: [
      {
        url: "https://aceeliteproperties.com//assets/images/banner-image.webp",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact  | Ace Elite Properties",
    description: "Discover amazing properties with our real estate platform",
    images: ["https://aceeliteproperties.com//assets/images/banner-image.webp"],
  },
};

export default function ContactPage() {
  return (
    <section className="contact_page">
      <div className="container">
        <div className="grid_row">
          <div className="content_left">
            <div className="badge">Contact Us</div>
            <h1>Why Ace ELite Porpties</h1>
            <ul>
              <li>
                <Check />
                Expert property listings and market insights
              </li>
              <li>
                <Check />
                Quick and seamless property transactions
              </li>
              <li>
                <Check />
                No hidden fees or long-term commitments
              </li>
              <li>
                <Check />
                Access to exclusive listings and trusted partners nationwide
              </li>
              <li>
                <Check />
                Dedicated, Dubai-based real estate agents providing personalized
                service
              </li>
            </ul>
          </div>
          <div className="contact_right">
            <ContactForm source="contact-page" />
          </div>
        </div>
      </div>
    </section>
  );
}
