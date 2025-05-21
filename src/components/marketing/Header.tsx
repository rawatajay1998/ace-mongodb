"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const WebsiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu open/close

  // Toggle the menu state
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header>
        <div className="nav_container">
          <Link href={"/"} className="logo">
            <Image
              src={"/assets/images/ace-logo-blue.png"}
              width={100}
              height={100}
              alt="Logo"
            />
          </Link>
          <div className="hamburger" onClick={toggleMenu}>
            <MenuIcon size={24} />
          </div>
          <div className={`nav ${menuOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/offplan/dubai">Off Plan</Link>
              </li>

              <li>
                <Link href="/secondary/dubai">Secondary</Link>
              </li>
              <li>
                <Link href="/rental/dubai">Rental</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/contact" className="submmit">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default WebsiteHeader;
