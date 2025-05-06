"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { MapPinHouse, UsersRound } from "lucide-react";

// STEP 1: Define your menu structure
const menuItems = [
  {
    label: "Properties",
    icon: MapPinHouse,
    key: "dashboard/properties",
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
        key: "/dashboard/properties/pending",
      },
      {
        label: "Pending Properties",
        key: "/dashboard/properties/approved",
      },
    ],
  },
  {
    label: "Agents",
    icon: UsersRound,
    key: "dashboard/agents",
    children: [
      {
        label: "Agents List",
        key: "/dashboard/agents",
      },
      {
        label: "Add Agent",
        key: "/dashboard/agents/add",
      },
    ],
  },
];

// STEP 2: Helper to convert to AntD menu items
const generateMenuItems = (items: typeof menuItems) => {
  return items.map((item) => {
    const hasChildren = item.children && item.children.length > 0;
    return {
      key: item.key,
      icon: React.createElement(item.icon),
      children: hasChildren
        ? item.children.map((child) => ({
            key: child.key,
            label: <Link href={child.key}>{child.label}</Link>,
          }))
        : undefined,
      label: hasChildren ? (
        item.label
      ) : (
        <Link href={item.key}>{item.label}</Link>
      ),
    };
  });
};

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const pathname = usePathname();

  // STEP 3: Find selected and open keys based on route
  const selectedKey = pathname;
  const openKey = menuItems.find((item) =>
    item.children?.some((child) => child.key === pathname)
  )?.key;

  const items: MenuProps["items"] = generateMenuItems(menuItems);

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
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKey ? [openKey] : []}
        style={{ height: "100%", paddingBlock: 40 }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
