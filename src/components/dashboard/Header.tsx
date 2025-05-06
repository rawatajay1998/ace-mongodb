"use client";

import React from "react";
import { Button } from "antd";
import { LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardHeader = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/auth/login"); // or your login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      style={{
        padding: "0 16px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <X /> : <Menu />}
        onClick={onToggle}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
          fontWeight: "600",
        }}
      />
      <Button
        type="primary"
        onClick={handleLogout}
        style={{
          fontSize: "14px",
          width: "auto",
          height: 36,
        }}
      >
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;
