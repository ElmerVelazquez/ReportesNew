import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EquipmentTable from "../../components/tables/BasicTables/EquipmentsTable";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { AddIcon, TrashBinIcon } from "@/icons/index";
import { useModal } from "@/hooks/useModal";

export default function Equipments() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
          
      <PageBreadcrumb pageTitle="Equipments" />
      <div className="space-y-6">
        
        <ComponentCard 
        title="Lists of Equipments" 
        node={
          <div className="flex justify-end gap-3 text-xs" >
            <Button 
              onClick={openModal} 
              startIcon={<AddIcon />} 
              variant={selectedRowId !== null ? 'secondary' : 'primary'} 
              size="sm">
              <span className="text-white">{selectedRowId !== null ? 'Edit' : 'Add'}</span>
            </Button>
            <Button 
              startIcon={<TrashBinIcon />} 
              variant="outline" size="sm">
              <span className="text-red-500">Delete</span>
            </Button>
          </div>
        }>
          
          <EquipmentTable selectedRowId={selectedRowId} onRowSelect={setSelectedRowId} isOpen={isOpen} closeModal={closeModal} />
        </ComponentCard>
      </div>
    </>
  );
}
