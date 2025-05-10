"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { MapPinHouse, UsersRound } from "lucide-react";

type MenuItem = {
  label: string;
  key: string;
  icon?: any;
  hideForAgent?: boolean; // Flag to hide from agent
  children?: MenuItem[];
};

// STEP 1: Define your menu structure
const menuItems = [
  {
    label: "Properties",
    icon: MapPinHouse,
    key: "properties", // Changed
    children: [
      {
        label: "All Properties",
        key: "/dashboard/properties",
      },
      {
        label: "My Properties",
        key: "/dashboard/properties/myproperties",
      },
      {
        label: "Add Property",
        key: "/dashboard/properties/add",
      },
      {
        label: "Approved Properties",
        key: "/dashboard/properties/approved",
      },
      {
        label: "Pending Properties",
        key: "/dashboard/properties/pending",
      },
    ],
  },
  {
    label: "Agents",
    icon: UsersRound,
    key: "agents", // Changed
    children: [
      {
        label: "Agents List",
        key: "/dashboard/agents",
      },
      {
        label: "Add Agent",
        key: "/dashboard/agents/add",
        // hideForAgent: true,
      },
    ],
  },
  {
    label: "Master",
    icon: UsersRound,
    key: "master",
    hideForAgent: true,
    children: [
      {
        label: "Amenities",
        key: "/dashboard/master/amenities",
      },
      {
        label: "Category",
        key: "/dashboard/master/category",
      },
      {
        label: "Property Type",
        key: "/dashboard/master/property-types",
      },
    ],
  },
];

// Convert to AntD-compatible menu items and filter by role
const generateMenuItems = (
  items: MenuItem[],
  userRole: "admin" | "agent"
): MenuProps["items"] => {
  return items
    .map((item) => {
      const filteredChildren = item.children?.filter(
        (child) => !(userRole === "agent" && child.hideForAgent)
      );

      if (
        item.children &&
        (!filteredChildren || filteredChildren.length === 0)
      ) {
        return null; // Hide parent if no visible children
      }

      return {
        key: item.key,
        icon: item.icon ? React.createElement(item.icon) : undefined,
        label: item.label,
        children: filteredChildren?.map((child) => ({
          key: child.key,
          label: <Link href={child.key}>{child.label}</Link>,
        })),
      };
    })
    .filter(Boolean);
};

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const pathname = usePathname();
  const userRole: "admin" | "agent" = "agent"; // ⬅️ Replace with actual role logic

  const items = generateMenuItems(menuItems, userRole);

  const openKey = menuItems.find((item) =>
    item.children?.some((child) => child.key === pathname)
  )?.key;

  return (
    <Sider width={200} collapsible collapsed={collapsed}>
      <div className="image p-4">
        <Image
          src={"/assets/images/ace-logo-white.png"}
          alt="Logo"
          height={100}
          width={100}
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={openKey ? [openKey] : []}
        style={{ height: "100%", paddingBlock: 40 }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
