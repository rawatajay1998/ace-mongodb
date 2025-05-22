"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href?.startsWith("/")) {
          // Compose current full path with query string
          const currentFullPath =
            pathname +
            (searchParams?.toString() ? `?${searchParams.toString()}` : "");

          // If clicked href is exactly the current path (including query), do NOT start progress
          if (href === currentFullPath) {
            return;
          }

          NProgress.start();
        }
      }
    };

    document.addEventListener("click", handleStart);
    return () => {
      document.removeEventListener("click", handleStart);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams?.toString()]);

  return null;
}
