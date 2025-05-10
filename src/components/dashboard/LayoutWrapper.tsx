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
    // Simple check - adjust based on your auth system
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      // Very basic check - in real app, verify properly
      setIsAdmin(token.includes("admin"));
    }
  }, []);

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
