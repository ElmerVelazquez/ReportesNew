import {
  ColumnDef,
} from "@tanstack/react-table";
import StandardTable from "@/components/ui/table/StandardTable";
import { getEquipmentBrand, createEquipmentBrand } from "@/api/EquipmentBrand";
import { createEquipmentModel, getEquipmentTModel } from "@/api/EquipmentModel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddIcon } from "@/icons/index";
import Button from "@/components/ui/button/Button"; 
import Alert from "@/components/ui/alert/Alert";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { useState } from "react";


type marca = {
  id?: number,
  name: string,
}; 
type modelo = {
  id: number,
  name: string,
  brand: {
    id: number,
    name: string
  }
}; 


const columnsMarcas: ColumnDef<marca>[] = [
  { accessorKey: "name", header: "Marcas" },
];
const columnsModelos: ColumnDef<modelo>[] = [
  { accessorKey: "name", header: "modelos" }
];
interface BrandsTableProps {
  selectedModelId: string | null;
  onRowSelectedModelId: (id: string | null) => void;
  selectedBrandId: string | null;
  onRowSelectedBrandId: (id: string | null) => void;

}

export default function BrandsTable({ selectedModelId, onRowSelectedModelId, selectedBrandId, onRowSelectedBrandId}: BrandsTableProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const [modalMode, setModalMode] = useState<"brand" | "model">("model");
    const [inputValue, setInputValue] = useState("");
    const queryClient = useQueryClient();

    const handleclick = (mode: "brand" | "model") => {
      setModalMode(mode);
      openModal();
    }
    console.log("Selected Brand ID:", selectedBrandId);
    const handleAddClick = () => {
      if (modalMode === "brand") {
        // Lógica para agregar marca
        addBrand({ name: inputValue }); // Aquí deberías reemplazar con los datos reales del formulario
      }else{
        addModel({ name: inputValue, equipment_brand_id: Number(selectedBrandId)+1 }); // Aquí deberías reemplazar con los datos reales del formulario
      }        
    }

    const { mutate: addBrand } = useMutation({
      mutationFn: createEquipmentBrand,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });

      }
    });
    const { mutate: addModel } = useMutation({
      mutationFn: createEquipmentModel,
      onSuccess: () => {
        console.log("Model added successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      }
    });
    const { data: dataMarca = [], isLoading: loadingMarcas, isError: errorMarcas } = useQuery({
      queryKey: ["EquipmentBrands"],
      queryFn: getEquipmentBrand,
      select: (res) => res.data,
      staleTime: 1000 * 60, // 1 minuto
    });

    const { data: dataModelos = [], isLoading: loadingModelos, isError: errorModelos } = useQuery({
      queryKey: ["EquipmentModels"],
      queryFn: getEquipmentTModel,
      select: (res) => res.data,
      staleTime: 1000 * 60, // 1 minuto
    });
    const modelosFiltrados = selectedBrandId
    ? dataModelos.filter((m: modelo) => m.brand.id === Number(selectedBrandId)+1)
    : dataModelos;

    let options = dataMarca.map((marca: marca) => ({
      value: marca.id,
      label: marca.name
    }));
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
                {(modalMode === "brand") ? "Agregar Marca" : "Agregar Modelo"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Introduce los datos {(modalMode === "brand") ? "de la marca" : "del modelo"}
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <Input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className="mb-4" placeholder={(modalMode === "brand") ? "Nombre de la marca" : "Nombre del modelo"}/>
                  {(modalMode === "model") && (
                    <Select options={options} placeholder="Marca" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  )}
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
                onClick={handleAddClick}
                type="button"
                className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto bg-brand-500 hover:bg-brand-600}`}
              >
                Add
              </button>
            </div>
          </div>
      </Modal>
      <div className="flex gap-10 justify-center">
          <div className="w-full">
            <div className="flex justify-end gap-3 text-xs pb-3" >
              <Button 
                onClick={() => handleclick("brand")} 
                startIcon={<AddIcon />} 
                variant={'primary'} 
                size="xs">
                <span className="text-white">Add</span>
              </Button>
            </div>
              <StandardTable<marca> deleteBtn={true} editBtn={true}  selectRowId={selectedBrandId} onRowSelect={onRowSelectedBrandId} columns={columnsMarcas} data={dataMarca} />
          </div>
          <div className="w-full">
            <div className="flex justify-end gap-3 text-xs pb-3" >
              <Button 
                onClick={() => handleclick("model")} 
                startIcon={<AddIcon />} 
                variant={selectedBrandId ? 'primary' : 'outline'} 
                size="xs"
                disabled={!selectedBrandId} // Deshabilitar si no hay una marca seleccionada
                >
                <span className="text-white">Add</span>
              </Button>
            </div>
              <StandardTable<modelo> editBtn={true} deleteBtn={true}  selectRowId={selectedModelId} onRowSelect={onRowSelectedModelId} columns={columnsModelos} data={modelosFiltrados} />
          </div>
      </div>
      {(loadingMarcas || loadingModelos) && (
        <div className="flex justify-center">
          <motion.div
            className="w-13 h-13 border-5 rounded-full border-gray-300 border-t-blue-500"
            // Decimos qué propiedad animar (rotar 360 grados)
            animate={{ rotate: 360 }}
            // Aplicamos la configuración de transición que definimos arriba
            transition={
              {
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut"
              }
            }
          />
        </div>
      )}
      {(errorMarcas || errorModelos) && (
        <motion.div 
          initial={{  x: 100 }} // Empieza invisible y 20px abajo
          animate={{  x: 0 }}  // Termina visible y en su posición
          transition={{ duration: 0.3 }}  // Duración de medio segundo
          className="absolute w-[50%] bottom-[2%] left-[25%]"
        >
          <Alert
            title="Error de conexion"
            message="Error al obtener los datos." 
            variant={"error"}
          />
        </motion.div>
      )}
    </>  
  );
};
