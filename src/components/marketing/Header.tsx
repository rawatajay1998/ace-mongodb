"use client";

import { KeyRound, MenuIcon } from "lucide-react";
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
                <Link href="/search?type=offplan">Off Plan</Link>
              </li>

              <li>
                <Link href="/">Secondary</Link>
              </li>
              <li>
                <Link href="/">Rent</Link>
              </li>
              <li>
                <Link href="/agents">Agent</Link>
              </li>
              <li>
                <Link href="/">Explore More</Link>
              </li>
              <li>
                <Link href="/">Contact</Link>
              </li>
              <li>
                <Link href="/" className="submmit">
                  <KeyRound size={14} />
                  Submit Property
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
