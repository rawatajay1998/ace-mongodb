"use client";

import { Modal, Button, Form } from "antd";
import TipTapEditor from "@/components/dashboard/text-editor/Editor"; // your custom editor
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
};

export default function EditorModal({ visible, onClose, slug }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/property/${slug}`)
        .then((res) => {
          setData(res.data.property);

          form.setFieldsValue(res.data.property);
        })
        .catch(() => toast.error("Failed to fetch data"));
    }
  }, [slug, visible]);

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      setLoading(true);
      await axios.put("/api/property/edit/editor", { ...values, slug });
      toast.success("Updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Edit Property Details"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Save
        </Button>,
      ]}
      width={900}
    >
      <Form layout="vertical" form={form}>
        {data && (
          <>
            <Form.Item name="aboutProperty" label="About Property">
              <TipTapEditor
                key={`about-${data._id}`}
                initialContent={data.aboutProperty}
                onEditorChange={(value) =>
                  form.setFieldValue("aboutProperty", value)
                }
              />
            </Form.Item>

            <Form.Item name="pricingSection" label="Pricing Section">
              <TipTapEditor
                key={`pricing-${data._id}`}
                initialContent={data.pricingSection}
                onEditorChange={(value) =>
                  form.setFieldValue("pricingSection", value)
                }
              />
            </Form.Item>

            <Form.Item name="locationAdvantages" label="Location Advantages">
              <TipTapEditor
                key={`location-${data._id}`}
                initialContent={data.locationAdvantages}
                onEditorChange={(value) =>
                  form.setFieldValue("locationAdvantages", value)
                }
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
