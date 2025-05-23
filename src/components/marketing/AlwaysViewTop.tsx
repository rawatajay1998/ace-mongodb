"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AlwaysViewTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Give Next.js time to paint the new page first
    const timeout = setTimeout(() => {
      // Use both window and document scroll for full coverage
      window.scrollTo({ top: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0); // or try 100ms if needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
