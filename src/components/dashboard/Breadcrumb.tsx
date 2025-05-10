import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
  name: string;
  currentUrl: string;
}

const Breadcrumb = ({ name, currentUrl }: BreadcrumbProps) => {
  return (
    <ul className="flex gap-6 breadcrumb mb-8">
      <li>
        <Link href={"/"} className="flex gap-2 items-center">
          <Home size={16} /> Home
        </Link>
      </li>
      <li>
        <Link href={currentUrl}>{name}</Link>
      </li>
    </ul>
  );
};

export default Breadcrumb;
