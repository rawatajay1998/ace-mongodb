"use client";

import { Modal, Tooltip, message } from "antd";
import { Twitter, Facebook, MessageCircle, Copy, Share2 } from "lucide-react";
import { WechatOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { useState } from "react";

const shareOptions = [
  { icon: <Twitter color="#1DA1F2" />, label: "Twitter" },
  { icon: <Facebook color="#1877F2" />, label: "Facebook" },

  {
    icon: <WhatsAppOutlined style={{ color: "#25D366", fontSize: 20 }} />,
    label: "WhatsApp",
  },
  { icon: <MessageCircle color="#006AFF" />, label: "Messenger" },

  {
    icon: <WechatOutlined style={{ color: "#7BB32E", fontSize: 20 }} />,
    label: "WeChat",
  },
  { icon: <Share2 />, label: "More" },
];

export default function ShareModal({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      message.success("Link copied to clipboard");
    } catch {
      message.error("Failed to copy link");
    }
  };

  return (
    <>
      <button className="brochuure_btn" onClick={() => setOpen(true)}>
        <Share2 size={16} />
        Share
      </button>

      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        centered
        title="Share"
      >
        <div className="grid grid-cols-4 gap-4 text-center py-2">
          {shareOptions.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="rounded-full bg-gray-100 p-3">{icon}</div>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-1 text-sm font-medium">Page Link</p>
          <div className="flex items-center justify-between border rounded px-3 py-2 bg-gray-50">
            <span className="text-sm truncate">{url}</span>
            <Tooltip title="Copy Link">
              <Copy className="cursor-pointer" size={16} onClick={handleCopy} />
            </Tooltip>
          </div>
        </div>
      </Modal>
    </>
  );
}
