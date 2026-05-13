import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EmployeesTable from "@/components/tables/BasicTables/EmployeesTable";

export default function Employees() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  return (
    <div>
      <PageMeta
        title="Empleados | Reportes"
        description="Vista de empleados para administrar emisores y receptores de registros"
      />
      <PageBreadcrumb pageTitle="Empleados" />
      <div className="space-y-6">
        <ComponentCard title="Listado de empleados">
          <EmployeesTable selectedRowId={selectedRowId} onRowSelect={setSelectedRowId} />
        </ComponentCard>
      </div>
    </div>
  );
}
