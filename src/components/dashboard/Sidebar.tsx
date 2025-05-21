"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { Mail, MapPinHouse, UsersRound } from "lucide-react";

type MenuItem = {
  label: string;
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // {
      //   label: "All Properties",
      //   key: "/dashboard/properties",
      //   hideForAgent: true,
      // },
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
        hideForAgent: true,
      },
      {
        label: "Pending Properties",
        key: "/dashboard/properties/pending",
        hideForAgent: true,
      },
      {
        label: "Home Featured",
        key: "/dashboard/home-featured", // Changed
        hideForAgent: true,
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
        hideForAgent: true,
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
        hideForAgent: true,
      },
      {
        label: "Developer",
        key: "/dashboard/master/developer",
        hideForAgent: true,
      },
      {
        label: "Property Category",
        key: "/dashboard/master/category",
        hideForAgent: true,
      },
      {
        label: "Property Sub-Category",
        key: "/dashboard/master/subcategory",
        hideForAgent: true,
      },
      {
        label: "Property Status",
        key: "/dashboard/master/property-status",
        hideForAgent: true,
      },
      {
        label: "Property Type",
        key: "/dashboard/master/property-types",
        hideForAgent: true,
      },
      {
        label: "States",
        key: "/dashboard/master/states",
        hideForAgent: true,
      },
      {
        label: "Cities",
        key: "/dashboard/master/cities",
        hideForAgent: true,
      },
      {
        label: "Areas",
        key: "/dashboard/master/areas",
        hideForAgent: true,
      },
      {
        label: "Payment Plan",
        key: "/dashboard/master/payment-plan",
        hideForAgent: true,
      },
    ],
  },
  {
    label: "Enquiries",
    icon: Mail,
    key: "enquiry", // Changed
    hideForAgent: true,
    children: [
      {
        label: "Contact Enquiries",
        key: "/dashboard/enquiry/contact-enquiry",
        hideForAgent: true,
      },
      {
        label: "Popup Enquiries",
        key: "/dashboard/enquiry/popup-enquiry",
        hideForAgent: true,
      },
    ],
  },
  {
    label: "Careers",
    icon: Mail,
    key: "careers", // Changed
    hideForAgent: true,
    children: [
      {
        label: "Jobs",
        key: "/dashboard/careers",
        hideForAgent: true,
      },
      {
        label: "Applications",
        key: "/dashboard/careers/applications",
        hideForAgent: true,
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
      // If the parent item has hideForAgent, hide it for agents
      const shouldHideParent = userRole === "agent" && item.hideForAgent;

      // Filter children if the user is an agent and the child has hideForAgent
      const filteredChildren = item.children?.filter(
        (child) => !(userRole === "agent" && child.hideForAgent)
      );

      // If the parent has hideForAgent and there are no children left, return null
      if (
        shouldHideParent &&
        (!filteredChildren || filteredChildren.length === 0)
      ) {
        return null;
      }

      // Return the parent item with its filtered children (if any)
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
    .filter(Boolean); // Remove null values (hidden items)
};

const Sidebar = ({
  collapsed,
  isAdmin,
}: {
  collapsed: boolean;
  isAdmin: boolean;
}) => {
  const pathname = usePathname();
  const userRole: "admin" | "agent" = isAdmin ? "admin" : "agent";

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
