"use client";

import { Modal, Input, Form, Button } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

interface EditMetaInfoModalProps {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
}

interface MetaFormData {
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export default function EditMetaInfoModal({
  visible,
  onClose,
  slug,
  onSuccess,
}: EditMetaInfoModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetaFormData>();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/property/${slug}`);
        const { metaTitle, metaDescription } = res.data.property;
        reset({ metaTitle, metaDescription });
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (visible) {
      fetchProperty();
    }
  }, [slug, visible, reset]);

  const onSubmit = async (data: MetaFormData) => {
    try {
      await axios.put(`/api/property/edit/meta-info`, {
        slug,
        ...data,
      });
      toast.success("Meta info updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title="Edit Meta Information"
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Meta Title"
          validateStatus={errors.metaTitle ? "error" : ""}
        >
          <Controller
            name="metaTitle"
            control={control}
            rules={{ required: "Meta title is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Meta Title" />
            )}
          />
          {errors.metaTitle && (
            <p className="text-red-500">{errors.metaTitle.message}</p>
          )}
        </Form.Item>

        <Form.Item
          label="Meta Description"
          validateStatus={errors.metaDescription ? "error" : ""}
        >
          <Controller
            name="metaDescription"
            control={control}
            rules={{ required: "Meta description is required" }}
            render={({ field }) => (
              <Input.TextArea
                rows={4}
                {...field}
                placeholder="Meta Description"
              />
            )}
          />
          {errors.metaDescription && (
            <p className="text-red-500">{errors.metaDescription.message}</p>
          )}
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Save Changes
        </Button>
      </Form>
    </Modal>
  );
}
