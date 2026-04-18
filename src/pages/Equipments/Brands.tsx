import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import BrandsTable from "@/components/tables/BasicTables/BrandsTable";
import { useState } from "react";

export default function Brands() {
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    return (
        <div>
            <PageMeta
                title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            /> 
            <PageBreadcrumb pageTitle="Equipments" />
            <div className="space-y-6">
                <ComponentCard title="Brands & Models">
                              <BrandsTable 
                              selectedModelId={selectedModelId} 
                              onRowSelectedModelId={setSelectedModelId} 
                              selectedBrandId={selectedBrandId} 
                              onRowSelectedBrandId={setSelectedBrandId}
                              />
                </ComponentCard>
            </div>
        </div>
    );
}