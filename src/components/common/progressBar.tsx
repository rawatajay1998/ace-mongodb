"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function RouteLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = (e) => {
      const target = e.target as HTMLElement;
      if (target.closest("a[href]")) {
        const href = (target.closest("a") as HTMLAnchorElement).getAttribute(
          "href"
        );
        if (href?.startsWith("/")) {
          NProgress.start();
        }
      }
    };

    document.addEventListener("click", handleStart);

    return () => {
      document.removeEventListener("click", handleStart);
    };
  }, []);

  useEffect(() => {
    // stop NProgress after pathname changes (navigation complete)
    NProgress.done();
  }, [pathname]);

  return null;
}
