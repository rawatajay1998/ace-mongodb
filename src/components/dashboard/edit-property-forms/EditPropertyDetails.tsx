"use client";

import { Modal, Button, Form, Select, Input } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  visible: boolean;
  onClose: () => void;
  slug: string;
  onSuccess?: () => void;
};

export default function EditDetailsModal({
  visible,
  onClose,
  slug,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState(null);

  const [options, setOptions] = useState({
    statuses: [],
    types: [],
    categories: [],
    subCategories: [],
    states: [],
    cities: [],
    areas: [],
    developers: [],
  });

  useEffect(() => {
    if (!slug || !visible) return;

    const fetchData = async () => {
      try {
        // Fetch property data first
        const propertyRes = await axios.get(`/api/property/${slug}`);
        const property = propertyRes.data.property;
        setPropertyData(property);

        // Then fetch all options
        const [
          statusesRes,
          typesRes,
          categoriesRes,
          subCategoriesRes,
          statesRes,
          developersRes,
        ] = await Promise.all([
          axios.get("/api/property-status"),
          axios.get("/api/propertyTypes"),
          axios.get("/api/categories"),
          axios.get("/api/subcategories"),
          axios.get("/api/states"),
          axios.get("/api/developer"),
        ]);

        setOptions({
          statuses: statusesRes.data,
          types: typesRes.data,
          categories: categoriesRes.data,
          subCategories: subCategoriesRes.data,
          states: statesRes.data,
          cities: [], // Will be loaded next if state exists
          areas: [], // Will be loaded next if city exists
          developers: developersRes.data.data,
        });

        // Load cities if state exists
        if (property.state) {
          const citiesRes = await axios.get(
            `/api/cities?state=${property.state}`
          );
          setOptions((prev) => ({ ...prev, cities: citiesRes.data }));

          // Load areas if city exists
          if (property.city) {
            const areasRes = await axios.get(
              `/api/areas?city=${property.city}`
            );
            setOptions((prev) => ({ ...prev, areas: areasRes.data }));
          }
        }

        // Set form values after all data is loaded
        form.setFieldsValue({
          // IDs
          propertyStatus: property.propertyStatus,
          propertyType: property.propertyType,
          propertyCategory: property.propertyCategory,
          state: property.state,
          city: property.city,
          area: property.area,
          developer: property.developer,

          // Names
          propertyStatusName: property.propertyStatusName,
          propertyTypeName: property.propertyTypeName,
          propertyCategoryName: property.propertyCategoryName,
          stateName: property.stateName,
          cityName: property.cityName,
          areaName: property.areaName,
          developerName: property.developerName,

          // Other fields
          propertyPrice: property.propertyPrice,
          paymentPlan: property.paymentPlan,
          unitType: property.unitType,
          areaSize: property.areaSize,
        });
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchData();
  }, [slug, visible, form]);

  const handleStateChange = async (stateId: string) => {
    try {
      const state = options.states.find((s) => s._id === stateId);
      form.setFieldsValue({
        stateName: state?.name,
        city: undefined,
        cityName: undefined,
        area: undefined,
        areaName: undefined,
      });

      const res = await axios.get(`/api/cities?state=${stateId}`);
      setOptions((prev) => ({
        ...prev,
        cities: res.data,
        areas: [], // Clear areas when state changes
      }));
    } catch {
      toast.error("Failed to load cities");
    }
  };

  const handleCityChange = async (cityId: string) => {
    try {
      const city = options.cities.find((c) => c._id === cityId);
      form.setFieldsValue({
        cityName: city?.name,
        area: undefined,
        areaName: undefined,
      });

      const res = await axios.get(`/api/areas?city=${cityId}`);
      setOptions((prev) => ({ ...prev, areas: res.data }));
    } catch {
      toast.error("Failed to load areas");
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    // When a select changes, update both the ID and name fields
    const option = options[
      name === "state"
        ? "states"
        : name === "city"
          ? "cities"
          : name === "area"
            ? "areas"
            : name === "developer"
              ? "developers"
              : name === "propertyType"
                ? "types"
                : name === "propertyCategory"
                  ? "categories"
                  : "statuses"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].find((item: any) => item._id === value);

    form.setFieldsValue({
      [name]: value,
      [`${name}Name`]: option?.name,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const {
        propertyTypeName,
        propertyCategoryName,
        propertyStatusName,
        cityName,
        stateName,
        areaName,
      } = form.getFieldsValue([
        "propertyTypeName",
        "propertyCategoryName",
        "propertyStatusName",
        "cityName",
        "stateName",
        "areaName",
      ]);

      // Prepare the payload according to your schema
      const payload = {
        ...propertyData,
        ...values,
        propertyTypeName,
        propertyCategoryName,
        propertyStatusName,
        cityName,
        stateName,
        areaName,
        slug,
      };

      await axios.put("/api/property/edit/details", payload);
      toast.success("Property updated");
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(error.message);
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
        <Button onClick={onClose} key="cancel">
          Cancel
        </Button>,
        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          key="save"
        >
          Save
        </Button>,
      ]}
      width={800}
    >
      <Form layout="vertical" form={form}>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: "propertyStatus",
              label: "Property Status",
              data: options.statuses,
            },
            {
              name: "propertyType",
              label: "Property Type",
              data: options.types,
            },
            {
              name: "propertyCategory",
              label: "Property Category",
              data: options.categories,
            },
            {
              name: "propertySubCategory",
              label: "Property Sub Category",
              data: options.subCategories,
            },
            {
              name: "state",
              label: "State",
              data: options.states,
              onChange: handleStateChange,
            },
            {
              name: "city",
              label: "City",
              data: options.cities,
              onChange: handleCityChange,
            },
            { name: "area", label: "Area", data: options.areas },
            {
              name: "developer",
              label: "Developer",
              data: options.developers.map((dev) => ({
                ...dev,
                name: dev.developerName || dev.name,
              })),
            },
          ].map(({ name, label, data, onChange }) => (
            <Form.Item
              key={name}
              name={name}
              label={label}
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                options={data.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(value) => {
                  handleSelectChange(name, value);
                  if (onChange) onChange(value);
                }}
                placeholder={`Select ${label}`}
              />
            </Form.Item>
          ))}

          <Form.Item
            name="propertyPrice"
            label="Property Price"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter property price" />
          </Form.Item>

          <Form.Item name="paymentPlan" label="Payment Plan">
            <Input placeholder="Enter payment plan" />
          </Form.Item>

          <Form.Item
            name="unitType"
            label="Unit Type"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter unit type" />
          </Form.Item>
          <Form.Item
            name="areaSize"
            label="Area Size"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter area size" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
