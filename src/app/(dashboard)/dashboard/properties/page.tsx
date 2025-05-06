import PropertyTable from "@/components/common/PropertyTable";

const Properties = () => {
  return (
    <div className="card">
      <h2 className="main_title">All Properties</h2>
      <PropertyTable fetchUrl="/api/properties/get" />
    </div>
  );
};

export default Properties;
