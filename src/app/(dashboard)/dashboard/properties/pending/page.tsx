"use client";
import PropertyTable from "@/components/common/PropertyTable";

const PendingPropertiesPage = () => {
  const approveProperty = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/approve/${propertyId}`, {
        method: "PATCH",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = await res.json();

      // You might want to show a success toast here
    } catch (error) {
      console.error("Error approving property:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-bold text-white mb-4 main_title">
        Pending Properties
      </h1>
      <PropertyTable
        fetchUrl="/api/properties/get/pending"
        showApproveButton={true}
        actionButtonText="Approve"
        onAction={approveProperty}
      />
    </div>
  );
};

export default PendingPropertiesPage;
