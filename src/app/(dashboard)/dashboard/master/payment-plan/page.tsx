"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  message,
  Space,
  Modal,
  Table,
  AutoComplete,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;

type Property = {
  _id: string;
  projectName: string;
  propertyPrice?: number;
};

type Step = {
  percentage: number;
  title: string;
  subtitle: string;
};

type PaymentPlan = {
  _id: string;
  property: Property;
  steps: Step[];
};

const PaymentPlanPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const [steps, setSteps] = useState<Step[]>([
    { percentage: 0, title: "", subtitle: "" },
    { percentage: 0, title: "", subtitle: "" },
    { percentage: 0, title: "", subtitle: "" },
  ]);

  const fetchPaymentPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/payment-plan", {
        params: {
          page,
          pageSize,
          search: searchTerm,
        },
      });
      setPaymentPlans(res.data.paymentPlans || []);
      setTotal(res.data.total || 0);
    } catch {
      message.error("Failed to fetch payment plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentPlans();
  }, [page, pageSize, searchTerm]);

  const fetchProperties = async (value: string) => {
    try {
      const { data } = await axios.get(`/api/search/property?q=${value}`);
      setSearchResults(data.results || []);
    } catch {
      message.error("Error fetching properties");
    }
  };

  const fetchPaymentPlan = async (propertyId: string) => {
    try {
      const res = await axios.get(`/api/payment-plan?propertyId=${propertyId}`);
      if (res.data && res.data.steps?.length === 3) {
        setSteps(res.data.steps);
      } else {
        resetSteps();
      }
    } catch {
      resetSteps();
    }
  };

  const resetSteps = () => {
    setSteps([
      { percentage: 0, title: "", subtitle: "" },
      { percentage: 0, title: "", subtitle: "" },
      { percentage: 0, title: "", subtitle: "" },
    ]);
  };

  const handlePropertySelect = async (value: string, option) => {
    const property = searchResults.find((p) => p._id === option.key);
    if (property) {
      setSelectedProperty(property);
      await fetchPaymentPlan(property._id);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof Step,
    value: string | number
  ) => {
    const updated = [...steps];
    updated[index][field] = field === "percentage" ? Number(value) : value;
    setSteps(updated);
  };

  // New: Open modal to edit existing plan
  const openEditModal = (plan: PaymentPlan) => {
    setSelectedProperty({ ...plan.property });
    setSteps(plan.steps.map((step) => ({ ...step })));
    setEditingPlanId(plan._id);
    setModalVisible(true);
  };

  const savePlan = async () => {
    if (!selectedProperty) return;
    try {
      if (editingPlanId) {
        // Update existing plan
        await axios.put("/api/payment-plan", {
          planId: editingPlanId,
          propertyId: selectedProperty._id,
          steps,
        });
        message.success("Payment plan updated!");
      } else {
        // Add new plan
        await axios.post("/api/payment-plan", {
          propertyId: selectedProperty._id,
          steps,
        });
        message.success("Payment plan saved!");
      }
      setModalVisible(false);
      setSelectedProperty(null);
      setEditingPlanId(null);
      resetSteps();
      fetchPaymentPlans();
    } catch {
      message.error("Failed to save payment plan");
    }
  };

  const deletePlan = async (propertyId: string) => {
    try {
      await axios.delete(`/api/payment-plan?propertyId=${propertyId}`);
      message.success("Payment plan deleted!");
      fetchPaymentPlans();
    } catch {
      message.error("Failed to delete payment plan");
    }
  };

  const columns = [
    {
      title: "Property",
      dataIndex: ["property", "projectName"],
      key: "projectName",
    },
    {
      title: "Plan Steps",
      key: "steps",
      render: (_, record: PaymentPlan) => (
        <div>
          {record.steps.map((step, idx) => (
            <div key={idx}>
              <strong>{step.percentage}%</strong> - {step.title} (
              {step.subtitle})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: PaymentPlan) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this payment plan?"
            onConfirm={() => deletePlan(record.property._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 className="main_title mb-0 flex items-center justify-between">
        Payment Plan Master
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalVisible(true);
            setSelectedProperty(null);
            setEditingPlanId(null);
            resetSteps();
          }}
        >
          Add Payment Plan
        </Button>
      </h3>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search Payment Plans by Project Name"
          onSearch={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 600 }}
        />
      </Space>

      <Table
        loading={loading}
        dataSource={paymentPlans}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Total ${total} items`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage);
            setPageSize(newPageSize);
          },
        }}
      />

      <Modal
        title={editingPlanId ? "Edit Payment Plan" : "Add Payment Plan"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedProperty(null);
          setEditingPlanId(null);
          resetSteps();
        }}
        onOk={savePlan}
        okText="Save Plan"
        width={800}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <AutoComplete
            style={{ width: "100%" }}
            options={searchResults.map((item) => ({
              value: item.projectName,
              key: item._id,
              label: item.projectName,
            }))}
            onSearch={(value) => {
              fetchProperties(value);
            }}
            onSelect={handlePropertySelect}
            placeholder="Search property by project name"
            value={selectedProperty?.projectName}
            disabled={!!selectedProperty}
          />

          {selectedProperty && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 16,
              }}
            >
              {steps.map((step, index) => (
                <div
                  key={index}
                  title={`Step ${index + 1}`}
                  style={{ width: "32%" }}
                >
                  <div>
                    <label>Percentage</label>
                    <Input
                      placeholder="Percentage"
                      type="number"
                      value={step.percentage}
                      onChange={(e) =>
                        handleInputChange(index, "percentage", e.target.value)
                      }
                      style={{ marginBottom: 8 }}
                    />
                  </div>
                  <div>
                    <label>Title</label>
                    <Input
                      placeholder="Title"
                      value={step.title}
                      onChange={(e) =>
                        handleInputChange(index, "title", e.target.value)
                      }
                      style={{ marginBottom: 8 }}
                    />
                  </div>
                  <div>
                    <label>Sub Title</label>
                    <Input
                      placeholder="Subtitle"
                      value={step.subtitle}
                      onChange={(e) =>
                        handleInputChange(index, "subtitle", e.target.value)
                      }
                      style={{ marginBottom: 8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default PaymentPlanPage;
