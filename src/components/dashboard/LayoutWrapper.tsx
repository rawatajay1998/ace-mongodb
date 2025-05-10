"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Layout } from "antd";
import DashboardHeader from "./Header";

const { Content } = Layout;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setIsAdmin(data.user?.role === "admin");
      } catch (err) {
        console.error("Error fetching user:", err);
        setIsAdmin(false);
      }
    };

    fetchRole();
  }, []);

  console.log(isAdmin);

  return (
    <>
      <Sidebar collapsed={collapsed} isAdmin={isAdmin} />
      <Layout>
        <DashboardHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
        <Content
          style={{
            padding: "60px 40px",
            background: "transparent",
            height: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </>
  );
};

export default LayoutWrapper;
