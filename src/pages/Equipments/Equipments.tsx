import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EquipmentTable from "../../components/tables/BasicTables/EquipmentsTable";
import Button from "@/components/ui/button/Button"; 
import { AddIcon } from "../../icons";
import { TrashBinIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import { useEffect, useState } from "react";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import { getEquipmentTypes } from "@/api/EquipmentType";


// Define el tipo de cada elemento
interface EquipmentOption {
  id: string; // depende de tu API
  name: string;
}

// Define el tipo de equipmentTypes
interface EquipmentTypes {
  data: EquipmentOption[]; // o el tipo que corresponda a tu API
}


export default function Equipments() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOption, setSelectedOption] = useState("1");
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypes | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  
    useEffect(() => {
             getEquipmentTypes()
            .then((equipmentTypes) => {
              console.log("Fetched equipment types:", equipmentTypes);
              console.log(equipmentTypes.data);
                setEquipmentTypes(equipmentTypes);
                
            })
            .catch((error) => {
                console.error("Error fetching equipment types:", error);
            });
    }, []);

const options = equipmentTypes?.data.map((option: EquipmentOption) => ({
  value: option.id,
  label: option.name,
})) ?? [];


  return (
    <>
      <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {"Agregar Equipo"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedRowId !== null ? 'Introduce los datos del equipo seleccionado' : 'Introduce los datos del nuevo equipo'}
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <div className="flex gap-6 mb-5">
                    <Radio id="rad1" name="rad1" label="Disponible" value="1" checked={selectedOption === "1"} onChange={() => setSelectedOption("1")} />
                    <Radio id="rad2" name="rad1" label="En servicio" value="2" checked={selectedOption === "2"} onChange={() => setSelectedOption("2")} />
                    <Radio id="rad3" name="rad1" label="Fuera de servicio" value="3" checked={selectedOption === "3"} onChange={() => setSelectedOption("3")} />
                  </div>
                  <Select options={options} placeholder="Tipo de equipo" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  <Select options={options} placeholder="Marca" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  <Select options={options} placeholder="Modelo" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  <Input className="mb-4" placeholder="Serial"/>
  
                  <TextArea placeholder="Nota" rows={4} className="mb-4"  value=""/>
                  
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                type="button"
                className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto ${selectedRowId !== null ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-500 hover:bg-brand-600'}`}
              >
                {selectedRowId !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
      </Modal>

      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <PageBreadcrumb pageTitle="Equipments" />
      <div className="flex justify-end gap-3 text-xs pb-3" >
        <Button 
          onClick={openModal} 
          startIcon={<AddIcon />} 
          variant={selectedRowId !== null ? 'secondary' : 'primary'} 
          size="sm">
          <span className="text-white">{selectedRowId !== null ? 'Edit' : 'Add'}</span>
        </Button>
          <Button startIcon={<TrashBinIcon />} variant="outline" size="sm"><span className="text-red-500">Delete</span></Button>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Lists of Equipments">

          <EquipmentTable selectedRowId={selectedRowId} onRowSelect={setSelectedRowId} />
        </ComponentCard>
      </div>
    </>
  );
}
