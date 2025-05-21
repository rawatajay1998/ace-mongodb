import "./styles.css";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Layout } from "antd";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      className="dashboard"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <LayoutWrapper>{children}</LayoutWrapper>
    </Layout>
  );
}
