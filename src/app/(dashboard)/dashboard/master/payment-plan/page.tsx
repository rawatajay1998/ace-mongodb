"use client";

import { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  message,
  Spin,
  Typography,
  Card,
  Space,
  Divider,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type Property = {
  _id: string;
  projectName: string;
  propertyPrice?: number;
};

type Step = {
  percentage: number;
  title: string;
  subtitle: string;
  iconUrl?: string;
};

const PaymentPlanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [steps, setSteps] = useState<Step[]>([
    { percentage: 0, title: "", subtitle: "", iconUrl: "" },
    { percentage: 0, title: "", subtitle: "", iconUrl: "" },
    { percentage: 0, title: "", subtitle: "", iconUrl: "" },
  ]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/search/property?q=${searchTerm}`);
      setResults(data.results || []);
    } catch {
      message.error("Error fetching properties");
    } finally {
      setLoading(false);
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
      { percentage: 0, title: "", subtitle: "", iconUrl: "" },
      { percentage: 0, title: "", subtitle: "", iconUrl: "" },
      { percentage: 0, title: "", subtitle: "", iconUrl: "" },
    ]);
  };

  const handleSelectProperty = async (property: Property) => {
    setSelectedProperty(property);
    await fetchPaymentPlan(property._id);
  };

  const handleInputChange = (
    index: number,
    field: keyof Step,
    value: string | number
  ) => {
    const updated = [...steps];

    if (field === "percentage") {
      updated[index][field] = Number(value) as Step["percentage"];
    } else if (field === "title") {
      updated[index][field] = value as Step["title"];
    } else if (field === "subtitle") {
      updated[index][field] = value as Step["subtitle"];
    } else if (field === "iconUrl") {
      updated[index][field] = value as Step["iconUrl"];
    }

    setSteps(updated);
  };

  const savePlan = async () => {
    if (!selectedProperty) return;
    try {
      await axios.post("/api/payment-plan", {
        propertyId: selectedProperty._id,
        steps,
      });
      message.success("Payment plan saved!");
    } catch {
      message.error("Failed to save payment plan");
    }
  };

  const deletePlan = async () => {
    if (!selectedProperty) return;
    try {
      await axios.delete(
        `/api/payment-plan?propertyId=${selectedProperty._id}`
      );
      resetSteps();
      message.success("Payment plan deleted!");
    } catch {
      message.error("Failed to delete payment plan");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {!selectedProperty ? (
        <>
          <Title level={3}>Search Property</Title>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search by project name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={fetchProperties}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" onClick={fetchProperties}>
              Search
            </Button>
          </Space>
          {loading ? (
            <Spin tip="Loading..." />
          ) : (
            <div>
              {results.map((property) => (
                <Card
                  key={property._id}
                  hoverable
                  style={{ marginBottom: 10 }}
                  onClick={() => handleSelectProperty(property)}
                >
                  <Title level={5}>{property.projectName}</Title>
                  {property.propertyPrice && (
                    <Text type="secondary">
                      AED {property.propertyPrice.toLocaleString()}
                    </Text>
                  )}
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <Title level={3}>
            Payment Plan for: {selectedProperty.projectName}
          </Title>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {steps.map((step, index) => (
              <Card
                key={index}
                title={`Step ${index + 1}`}
                style={{ width: "32%" }}
              >
                <Input
                  placeholder="Percentage"
                  type="number"
                  value={step.percentage}
                  onChange={(e) =>
                    handleInputChange(index, "percentage", e.target.value)
                  }
                  suffix="%"
                  style={{ marginBottom: 8 }}
                />
                <Input
                  placeholder="Title"
                  value={step.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                  style={{ marginBottom: 8 }}
                />
                <Input
                  placeholder="Subtitle"
                  value={step.subtitle}
                  onChange={(e) =>
                    handleInputChange(index, "subtitle", e.target.value)
                  }
                />
              </Card>
            ))}
          </div>

          <Divider />

          <Space>
            <Button type="primary" onClick={savePlan}>
              Save Plan
            </Button>
            <Button danger onClick={deletePlan} icon={<DeleteOutlined />}>
              Delete Plan
            </Button>
            <Button onClick={() => setSelectedProperty(null)}>Back</Button>
          </Space>
        </>
      )}
    </div>
  );
};

export default PaymentPlanPage;
