"use client";

import { Modal, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
}

export default function DeletePropertyModal({
  visible,
  onClose,
  slug,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete("/api/property/delete", { data: { slug } }); // send slug in body
      toast.success("Property deleted successfully");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Delete Property"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="delete"
          danger
          type="primary"
          loading={loading}
          onClick={handleDelete}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this property?</p>
    </Modal>
  );
}
