"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Layout } from "antd";
import DashboardHeader from "./Header";

const { Content } = Layout;

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <DashboardHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
        <Content
          style={{
            padding: "24px",
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
