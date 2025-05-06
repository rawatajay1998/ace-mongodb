import PropertyTable from "@/components/common/PropertyTable";

export default function AgentPropertiesPage() {
  return <PropertyTable fetchUrl="/api/properties/get/myproperties" />;
}
