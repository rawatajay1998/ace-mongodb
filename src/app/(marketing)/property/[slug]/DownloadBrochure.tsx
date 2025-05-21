"use client";
import PopupForm from "@/components/marketing/Popup";
import { Modal } from "antd";
import { CloudDownload } from "lucide-react";
import React, { useState } from "react";

type Props = {
  propertyName: string;
};

const DownloadBrochure = ({ propertyName }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <button className="brochuure_btn" onClick={() => setIsModalOpen(true)}>
        <CloudDownload />
        Download Brochure
      </button>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="modal_popup"
        style={{ width: "800px" }}
      >
        <div className="contact_form">
          <PopupForm popupSource="brochure" propertyName={propertyName} />
        </div>
      </Modal>
    </>
  );
};

export default DownloadBrochure;
