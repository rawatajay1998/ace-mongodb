"use client";
import SiteStatsBar from "@/app/(marketing)/home/HeaderAnalytics";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const WebsiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header>
      <SiteStatsBar />
      <div className="nav_container" ref={menuRef}>
        <Link href="/" className="logo" onClick={handleLinkClick}>
          <Image
            src="/assets/images/ace-logo-blue.png"
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
              <Link href="/" onClick={handleLinkClick}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/search/dubai?propertySubCategoryName=OffPlan"
                onClick={handleLinkClick}
              >
                Off Plan
              </Link>
            </li>
            <li>
              <Link
                href="/search/dubai?propertySubCategoryName=Secondary"
                onClick={handleLinkClick}
              >
                Secondary
              </Link>
            </li>
            <li>
              <Link
                href="/search/dubai?propertySubCategoryName=Rental"
                onClick={handleLinkClick}
              >
                Rental
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={handleLinkClick}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" onClick={handleLinkClick}>
                Careers
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={handleLinkClick}
                className="submmit"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;
