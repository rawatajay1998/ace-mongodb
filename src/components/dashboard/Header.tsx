"use client";

import React from "react";
import { Button } from "antd";
import { LogOut, Menu, X } from "lucide-react";
import SitemapGenerator from "./GenerateSitemap";
import toast from "react-hot-toast";

const DashboardHeader = ({
  collapsed,
  onToggle,
  isAdmin,
}: {
  collapsed: boolean;
  onToggle: () => void;
  isAdmin: boolean;
}) => {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        window.location.href = "/login";
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="header"
      style={{
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <X /> : <Menu />}
        onClick={onToggle}
        className="sidebar__toggler"
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
          fontWeight: "600",
        }}
      />

      <div className="flex gap-4 items-center">
        {isAdmin && <SitemapGenerator />}
        <Button
          type="primary"
          className="logout_btn"
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
    </div>
  );
};

export default DashboardHeader;
