import { KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const WebsiteHeader = () => {
  return (
    <>
      <header>
        <div className="nav_container">
          <div className="logo">
            <Image
              src={"/assets/images/ace-logo-blue.png"}
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          <div className="nav">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">Off Plan</Link>
              </li>
              <li>
                <Link href="/">Secondary</Link>
              </li>
              <li>
                <Link href="/">Rent</Link>
              </li>
              <li>
                <Link href="/">Agent</Link>
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
