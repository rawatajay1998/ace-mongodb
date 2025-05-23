import "./styles.css";

import LayoutWrapper from "@/components/dashboard/LayoutWrapper";
import { Layout } from "antd";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Ace Elite Properties",
  robots: {
    index: false,
    follow: true, // or false, depending on whether you want search engines to follow links
  },
};

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
