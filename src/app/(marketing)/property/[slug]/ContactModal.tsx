"use client";

import React from "react";
import { Modal, Form, Input, Button, Checkbox, Select } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import axios from "axios";
import Image from "next/image";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  propertyName?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
  open,
  onClose,
  propertyName,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        propertyName,
        role: "Buyer",
      };
      await axios.post("/api/enquiry/contact", payload);
      console.log("Form submitted:", payload);
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      className="contact_property_modal"
      closeIcon={<span style={{ fontSize: 20, color: "#888" }}>×</span>}
    >
      <div>
        <div className="header relative text-white p-8">
          <h3>Price Increasing Soon</h3>
          <h4>Lock your deal now</h4>
          <div className="logo">
            <Image
              src="/assets/images/ace-logo-blue.png"
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          <div className="triangle-left"></div>
          <div className="triangle-right"></div>
        </div>

        <div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            style={{ marginTop: 8 }}
          >
            <div>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Enter your name"
                  style={{
                    borderRadius: 14,
                    boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                    border: "1.5px solid #e0e7ef",
                    background: "#f8fafc",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="role"
                label="I am"
                hidden
                style={{ marginBottom: 0 }}
              >
                <Select
                  size="large"
                  placeholder="Select one"
                  style={{ borderRadius: 14, background: "#f8fafc" }}
                  options={[
                    { value: "Buyer", label: "Buyer" },
                    { value: "Seller", label: "Seller" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined />}
                  placeholder="Enter your phone number"
                  style={{
                    borderRadius: 14,
                    boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                    border: "1.5px solid #e0e7ef",
                    background: "#f8fafc",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  style={{
                    borderRadius: 14,
                    boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                    border: "1.5px solid #e0e7ef",
                    background: "#f8fafc",
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: "Please enter your message" }]}
              style={{ marginBottom: 0, marginTop: "20px" }}
            >
              <Input.TextArea
                rows={3}
                placeholder="Type your message"
                style={{
                  borderRadius: 14,
                  boxShadow: "0 1px 4px rgba(22,119,255,0.06)",
                  border: "1.5px solid #e0e7ef",
                  background: "#f8fafc",
                  resize: "none",
                }}
              />
            </Form.Item>
            <div className="flex items-baseline gap-2 mt-4">
              <Checkbox />
              <p className="checkbox_font">
                I confirm that I have read, understood, and agree to abide by
                the terms and conditions outlined for this enquiry submission.
              </p>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{
                  width: "100%",
                  borderRadius: 14,
                  background: "#0A264A",
                  border: "none",
                  fontWeight: 600,
                  boxShadow: "0 2px 12px rgba(80,227,194,0.13)",
                  transition: "background 0.3s",
                  marginTop: "20px",
                }}
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;
