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
        const propertyRes = await axios.get(`/api/property/${slug}`);
        const property = propertyRes.data.property;
        setPropertyData(property);

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
          cities: [],
          areas: [],
          developers: developersRes.data.data,
        });

        if (property.state) {
          const citiesRes = await axios.get(
            `/api/cities?state=${property.state}`
          );
          setOptions((prev) => ({ ...prev, cities: citiesRes.data }));

          if (property.city) {
            const areasRes = await axios.get(
              `/api/areas?city=${property.city}`
            );
            setOptions((prev) => ({ ...prev, areas: areasRes.data }));
          }
        }

        form.setFieldsValue({
          propertyStatus: property.propertyStatus,
          propertyType: Array.isArray(property.propertyType)
            ? property.propertyType
            : [property.propertyType],
          propertyCategory: property.propertyCategory,
          propertySubCategory: property.propertySubCategory,
          state: property.state,
          city: property.city,
          area: property.area,
          developer: property.developer,

          propertyStatusName: property.propertyStatusName,
          propertyTypeName: Array.isArray(property.propertyTypeName)
            ? property.propertyTypeName
            : [property.propertyTypeName],
          propertyCategoryName: property.propertyCategoryName,
          propertySubCategoryName: property.propertySubCategoryName,
          stateName: property.stateName,
          cityName: property.cityName,
          areaName: property.areaName,
          developerName: property.developerName,

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
        areas: [],
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

  const handleSelectChange = (name: string, value, optionList?) => {
    if (name === "propertyType" && Array.isArray(optionList)) {
      const typeNames = optionList.map((opt) => opt.label);
      form.setFieldsValue({
        propertyType: value,
        propertyTypeName: typeNames,
      });
    } else {
      const option = options[
        name === "state"
          ? "states"
          : name === "city"
            ? "cities"
            : name === "area"
              ? "areas"
              : name === "developer"
                ? "developers"
                : name === "propertyCategory"
                  ? "categories"
                  : name === "propertySubCategory"
                    ? "subCategories"
                    : "statuses"
      ].find((item) => item._id === value);

      form.setFieldsValue({
        [name]: value,
        [`${name}Name`]: option?.name || undefined,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const {
        propertyTypeName,
        propertyCategoryName,
        propertySubCategoryName,
        propertyStatusName,
        cityName,
        stateName,
        areaName,
      } = form.getFieldsValue([
        "propertyTypeName",
        "propertyCategoryName",
        "propertySubCategoryName",
        "propertyStatusName",
        "cityName",
        "stateName",
        "areaName",
      ]);

      const payload = {
        ...propertyData,
        ...values,
        propertyType: values.propertyType,
        propertyTypeName: Array.isArray(propertyTypeName)
          ? propertyTypeName
          : [propertyTypeName],
        propertyCategoryName,
        propertySubCategoryName,
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
              mode: "multiple" as const,
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ].map(({ name, label, data, onChange, mode }) => (
            <Form.Item
              key={name}
              name={name}
              label={label}
              rules={name === "developer" ? [] : [{ required: true }]}
            >
              <Select
                mode={mode}
                showSearch
                optionFilterProp="label"
                options={data.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                onChange={(value, optionList) =>
                  handleSelectChange(name, value, optionList)
                }
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
