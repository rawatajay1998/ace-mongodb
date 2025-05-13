import { Facebook, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WebsiteFooter = () => {
  return (
    <footer>
      <div className="container">
        <div className="top_row">
          <Image
            src={"/assets/images/ace-logo-white.png"}
            alt="Logo"
            height={100}
            width={100}
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
                <Link href={"/"}>Our Services</Link>
              </li>
              <li>
                <Link href={"/"}>Careers</Link>
              </li>
              <li>
                <Link href={"/"}>Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="top_locations">
            <h3 className="title">Top Locations</h3>
            <ul>
              <li>
                <Link href={"/"}>Business Bay</Link>
              </li>
              <li>
                <Link href={"/"}>Downtown Dubai</Link>
              </li>
              <li>
                <Link href={"/"}>Dubai Marina</Link>
              </li>
              <li>
                <Link href={"/"}>Palm Jumeriah</Link>
              </li>
            </ul>
          </div>
          <div className="contact">
            <h3 className="title">Contact Details</h3>
            <ul>
              <li>
                Ace Elite Properties 1103 Anantara Business Tower, Business Bay,
                Dubai UAE
              </li>
              <li>+971 55 526 6579</li>
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
