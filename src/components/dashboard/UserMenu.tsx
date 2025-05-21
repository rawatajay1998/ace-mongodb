"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Dropdown, MenuProps, Modal, Form, Input, Button } from "antd";
import { DownOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  address: string;
  phoneNumber: string;
  about: string;
  profileImageUrl: string;
}

interface Props {
  user: User;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  // Separate form instance for Update Details
  const {
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<User>({
    defaultValues: user,
  });

  // Separate form instance for Change Password
  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword },
    watch,
  } = useForm<PasswordFormData>();

  // Prefill Update modal form when user or modal state changes
  useEffect(() => {
    if (openUpdate && user) {
      resetUpdate(user);
    }
  }, [openUpdate, user, resetUpdate]);

  // Reset Password form fields when modal opens
  useEffect(() => {
    if (openPassword) {
      resetPassword();
    }
  }, [openPassword, resetPassword]);

  const openUpdateModal = () => {
    setOpenUpdate(true);
  };

  const openPasswordModal = () => {
    setOpenPassword(true);
  };

  // Submit handler for update details
  const onUpdateSubmit = async (data: User) => {
    try {
      await axios.post("/api/agents/update", { userId: user.id, ...data });
      toast.success("Profile updated successfully");
      setOpenUpdate(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // Submit handler for password change
  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await axios.post("/api/agents/update/change-password", {
        userId: user.id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      setOpenPassword(false);

      //logout the user
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = "/login"; // ← Hard reload to login page
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to change password"
        );
      } else {
        toast.error("Failed to change password");
      }
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Update Details",
      onClick: openUpdateModal,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: "Change Password",
      onClick: openPasswordModal,
      icon: <LockOutlined />,
    },
  ];

  console.log(user.profileImageUrl);

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Avatar src={user.profileImageUrl} alt={user.name} />
          <DownOutlined style={{ marginLeft: 8 }} />
        </div>
      </Dropdown>

      {/* Update Details Modal */}
      <Modal
        open={openUpdate}
        title="Update Details"
        onCancel={() => setOpenUpdate(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleSubmitUpdate(onUpdateSubmit)}>
          <Form.Item
            label="Name"
            validateStatus={errorsUpdate.name ? "error" : ""}
            help={errorsUpdate.name?.message}
          >
            <Controller
              name="name"
              control={controlUpdate}
              rules={{ required: "Name is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={errorsUpdate.email ? "error" : ""}
            help={errorsUpdate.email?.message}
          >
            <Controller
              name="email"
              control={controlUpdate}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => <Input type="email" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={errorsUpdate.country ? "error" : ""}
            help={errorsUpdate.country?.message}
          >
            <Controller
              name="country"
              control={controlUpdate}
              rules={{ required: "Country is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            validateStatus={errorsUpdate.address ? "error" : ""}
            help={errorsUpdate.address?.message}
          >
            <Controller
              name="address"
              control={controlUpdate}
              rules={{ required: "Address is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={errorsUpdate.phoneNumber ? "error" : ""}
            help={errorsUpdate.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={controlUpdate}
              rules={{ required: "Phone Number is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="About"
            validateStatus={errorsUpdate.about ? "error" : ""}
            help={errorsUpdate.about?.message}
          >
            <Controller
              name="about"
              control={controlUpdate}
              rules={{ required: "About is required" }}
              render={({ field }) => <Input.TextArea rows={3} {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Profile Image URL"
            validateStatus={errorsUpdate.profileImageUrl ? "error" : ""}
            help={errorsUpdate.profileImageUrl?.message}
          >
            <Controller
              name="profileImageUrl"
              control={controlUpdate}
              rules={{ required: "Profile Image URL is required" }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => setOpenUpdate(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={openPassword}
        title="Change Password"
        onCancel={() => setOpenPassword(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleSubmitPassword(onPasswordSubmit)}
        >
          <Form.Item
            label="Old Password"
            validateStatus={errorsPassword.oldPassword ? "error" : ""}
            help={errorsPassword.oldPassword?.message}
          >
            <Controller
              name="oldPassword"
              control={controlPassword}
              rules={{ required: "Old password is required" }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            validateStatus={errorsPassword.newPassword ? "error" : ""}
            help={errorsPassword.newPassword?.message}
          >
            <Controller
              name="newPassword"
              control={controlPassword}
              rules={{
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            validateStatus={errorsPassword.confirmPassword ? "error" : ""}
            help={errorsPassword.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={controlPassword}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              }}
              render={({ field }) => <Input.Password {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => setOpenPassword(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserMenu;
