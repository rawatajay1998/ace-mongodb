// components/AdminGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/auth"; // Import your loader component
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = verifyToken(token);
        if (decoded.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push("/dashboard/unauthorized");
        }
      } catch (error) {
        toast(`${error}`);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return <Loader />; // Show loading state while checking
  }

  if (!isAdmin) {
    return null; // Or redirect happens above
  }

  return <>{children}</>;
}
