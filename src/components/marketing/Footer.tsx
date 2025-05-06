import { Input } from "antd";
import { Facebook, Linkedin, SendHorizontal } from "lucide-react";
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
              <Facebook />
            </div>
            <div className="icon">
              <Linkedin />
            </div>
          </div>
        </div>
        <div className="links_row">
          <div className="contact_details">
            <h3 className="title">Connect</h3>
            <ul>
              <li>
                Ace Elite Properties 1103 Anantara Business Tower, Business Bay,
                Dubai UAE
              </li>
              <li>+971 55 526 6579</li>
              <li>info@AceEliteProperties.com</li>
            </ul>
          </div>
          <div className="quick_links">
            <h3 className="title">Quick Links</h3>
            <ul>
              <li>
                <Link href={"/"}>About</Link>
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
          <div className="newsletter">
            <h3 className="title">Newsletter</h3>
            <div className="input_field">
              <Input placeholder="Your Email Address" />
              <button>
                <SendHorizontal />
              </button>
            </div>
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
              <Link href={"/"}>Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;
