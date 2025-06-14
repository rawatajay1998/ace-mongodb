import { Button, Modal, message } from "antd";
import { useState } from "react";

const SitemapGenerator = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sitemap", {
        method: "POST",
      });

      if (res.ok) {
        message.success("Sitemap generated successfully!");
      } else {
        message.error("Failed to generate sitemap.");
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Generate Sitemap
      </Button>
      <Modal
        title="Generate Sitemap"
        open={open}
        onOk={handleGenerate}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
      >
        <p className="text-white">
          Are you sure you want to regenerate the sitemap with latest routes?
        </p>
      </Modal>
    </>
  );
};

export default SitemapGenerator;
