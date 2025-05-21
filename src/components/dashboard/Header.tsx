"use client";

import React from "react";
import { Button } from "antd";
import { LogOut, Menu, X } from "lucide-react";
// import UserMenu from "./UserMenu";

const DashboardHeader = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  // const [user, setUser] = useState(null);

  // const fetchAgent = async () => {
  //   const res = await fetch("/api/auth/user");
  //   const data = await res.json();

  //   setUser(data.user);
  // };

  // useEffect(() => {
  //   fetchAgent();
  // }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        window.location.href = "/login"; // ← Hard reload to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
      <div className="flex gap-4 item-center">
        {/* {user && <UserMenu user={user} />} */}
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
