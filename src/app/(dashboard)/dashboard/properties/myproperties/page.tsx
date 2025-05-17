import PropertyTable from "@/components/common/PropertyTable";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default function AgentPropertiesPage() {
  return (
    <>
      <Breadcrumb name="My Properties" currentUrl="/" />
      <PropertyTable
        fetchUrl="/api/properties/get/myproperties"
        showApproveButton={true}
        myPropertiesView={true}
      />
    </>
  );
}
