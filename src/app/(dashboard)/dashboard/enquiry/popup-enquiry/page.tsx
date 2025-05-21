"use client";

import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";

interface PopupEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  popupSource: string;
  projectName: string;
  message: string;
  createdAt: string;
}

const PopupEnquiries = () => {
  const [popupData, setPopupData] = useState<PopupEnquiry[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchName, setSearchName] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/enquiry/popup", {
        params: {
          page,
          pageSize,
          searchName,
          searchEmail,
        },
      });
      setPopupData(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchName, searchEmail]);

  const handleSearch = (value: string, field: "name" | "email") => {
    if (field === "name") {
      setSearchName(value);
    } else {
      setSearchEmail(value);
    }
    setPage(1); // Reset to the first page on search
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            value={searchName}
            onChange={(e) => handleSearch(e.target.value, "name")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => fetchData()}
            style={{ width: 90 }}
          >
            Search
          </Button>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Email"
            value={searchEmail}
            onChange={(e) => handleSearch(e.target.value, "email")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => fetchData()}
            style={{ width: 90 }}
          >
            Search
          </Button>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Source",
      dataIndex: "popupSource",
      key: "popupSource",
    },
    {
      title: "Proeject Name",
      dataIndex: "propertyName",
      key: "propertyName",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) =>
        text.length > 50 ? text.substring(0, 50) + "..." : text,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <div className="card">
      <h2 className="main_title">Popup Page Enquiries</h2>
      <Table
        columns={columns}
        dataSource={popupData}
        pagination={false}
        loading={loading}
        rowKey="_id"
      />
      <Pagination
        className="mt-2"
        current={page}
        pageSize={pageSize}
        total={totalRecords}
        onChange={handlePaginationChange}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
};

export default PopupEnquiries;
