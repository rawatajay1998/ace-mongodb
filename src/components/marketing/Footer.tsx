import { Facebook, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ICity {
  _id: string;
  name: string;
  slug: string;
}

async function getTopLocations(): Promise<ICity[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/featured?category=top-locations&type=table&includeCounts=true`
  );
  const data = await res.json();
  return data?.topLocations || [];
}

const WebsiteFooter = async () => {
  const topLocations = await getTopLocations();
  return (
    <footer>
      <div className="container">
        <div className="top_row">
          <Image
            src={"/assets/images/ace-logo-white.png"}
            alt="Logo"
            height={100}
            width={100}
            loading="lazy"
          />
          <div className="social_links">
            <p>Follow us on:</p>
            <div className="icon">
              <Link
                href={
                  "https://www.facebook.com/people/Ace-Elite-Properties/61572930571115/"
                }
              >
                <Facebook />
              </Link>
            </div>
            <div className="icon">
              <Link
                href={"https://www.linkedin.com/company/ace-elite-properties/"}
              >
                <Linkedin />
              </Link>
            </div>
            <div className="icon">
              <Link href={"https://www.instagram.com/aceeliteproperties/"}>
                <svg
                  fill="#fff"
                  width="24"
                  height="24"
                  viewBox="-2 -2 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin"
                >
                  <path d="M14.017 0h-8.07A5.954 5.954 0 0 0 0 5.948v8.07a5.954 5.954 0 0 0 5.948 5.947h8.07a5.954 5.954 0 0 0 5.947-5.948v-8.07A5.954 5.954 0 0 0 14.017 0zm3.94 14.017a3.94 3.94 0 0 1-3.94 3.94h-8.07a3.94 3.94 0 0 1-3.939-3.94v-8.07a3.94 3.94 0 0 1 3.94-3.939h8.07a3.94 3.94 0 0 1 3.939 3.94v8.07z" />
                  <path d="M9.982 4.819A5.17 5.17 0 0 0 4.82 9.982a5.17 5.17 0 0 0 5.163 5.164 5.17 5.17 0 0 0 5.164-5.164A5.17 5.17 0 0 0 9.982 4.82zm0 8.319a3.155 3.155 0 1 1 0-6.31 3.155 3.155 0 0 1 0 6.31z" />
                  <circle cx="15.156" cy="4.858" r="1.237" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="links_row">
          <div className="contact_details">
            <h3 className="title">About</h3>
            <p>
              Ace Elite Properties – Where Innovation Meets Real Estate
              Excellence At Ace Elite Properties, we’re not just another real
              estate brokerage in Dubai—we’re a technology-driven powerhouse
              redefining how properties are bought, sold, and invested in.
            </p>
          </div>
          <div className="quick_links">
            <h3 className="title">Quick Links</h3>
            <ul>
              <li>
                <Link href={"/about"}>About</Link>
              </li>
              <li>
                <Link href={"/blogs"}>Blogs</Link>
              </li>
              <li>
                <Link href={"/agents"}>Agents</Link>
              </li>
              <li>
                <Link href={"/careers"}>Careers</Link>
              </li>
              <li>
                <Link href={"/contact"}>Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="top_locations">
            <h3 className="title">Top Locations</h3>
            <ul>
              {topLocations.map((loc) => (
                <li key={loc._id}>
                  <Link href={`/search/${loc.slug}`}>{loc.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="contact">
            <h3 className="title">Contact Details</h3>
            <ul>
              <li>
                Ace Elite Properties 1103 Anantara Business Tower, Business Bay,
                Dubai UAE
              </li>
              <li>+971 45757466</li>
              <li>info@AceEliteProperties.com</li>
            </ul>
          </div>
        </div>
        <div className="copyrights_row">
          <p className="copyright">
            ©2025 Ace Elite Properties. All Rights Reserved
          </p>
          <ul>
            <li>
              <Link href={"/"}>Terms Of Service</Link>
            </li>
            <li>
              <Link href={"/privacy"}>Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;
