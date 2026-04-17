import {
  ColumnDef,
} from "@tanstack/react-table";
import StandardTable from "@/components/ui/table/StandardTable";
import { getEquipmentBrand, createEquipmentBrand, updateEquipmentBrand } from "@/api/EquipmentBrand";
import { createEquipmentModel, getEquipmentTModel, updateEquipmentModel } from "@/api/EquipmentModel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddIcon } from "@/icons/index";
import Button from "@/components/ui/button/Button"; 
import Alert from "@/components/ui/alert/Alert";
import { motion, number } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Input from "@/components/form/input/InputField";
import { useState } from "react";


type marca = {
  id: string,
  name: string,
}; 
type modelo = {
  id: string,
  name: string,
  brand: {
    id: string,
    name: string
  }
};
type modalMode = "addBrand" | "addModel" | "editBrand" | "editModel"; 


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
    const [modalMode, setModalMode] = useState<modalMode>("addModel");
    const [inputValue, setInputValue] = useState("");
    const queryClient = useQueryClient();
    const [edithId, setEdithId] = useState<string | null>(null);

    const handleclick = (mode: modalMode, id?: string | null) => {
      setModalMode(mode);
      setEdithId(id || null);
      openModal();
    }
    const handleAddEdithClick = () => {
      if (modalMode === "addBrand") {
        // Lógica para agregar marca
        addBrand({ name: inputValue });
        setInputValue(""); // Aquí deberías reemplazar con los datos reales del formulario
      }else if (modalMode === "addModel") {
        addModel({ name: inputValue, equipment_brand_id: Number(selectedBrandId)+1 }); // Aquí deberías reemplazar con los datos reales del formulario
        setInputValue("");
      }else if (modalMode === "editBrand") {
        editBrand( {id: Number(edithId), name: inputValue} ); // Lógica para editar marca
        console.log("Edit brand with id:", edithId, "and new name:", inputValue);
      }else if (modalMode === "editModel") {
        editModel( {id: Number(edithId), name: inputValue, brandId: Number(selectedBrandId)} ); // Lógica para editar modelo
        console.log("Edit model with id:", edithId, "and new name:", inputValue);
      }
    }

    const { mutate: addBrand, isPending: isAddingBrand, isError: isAddingBrandError, error: addingBrandError } = useMutation({
      mutationFn: createEquipmentBrand,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });

      }
    });
    const { mutate: addModel, isPending: isAddingModel, isError: isAddingModelError, error: addingModelError } = useMutation({
      mutationFn: createEquipmentModel,
      onSuccess: () => {
        console.log("Model added successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      }
    });
    const { mutate: editBrand, isPending: isEditingBrand, isError: isEditingBrandError, error: editingBrandError } = useMutation({
      mutationFn: updateEquipmentBrand,
      onSuccess: () => {
        console.log("Brand edited successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
      }
    });
    const { mutate: editModel, isPending: isEditingModel, isError: isEditingModelError, error: editingModelError } = useMutation({
      mutationFn: updateEquipmentModel,
      onSuccess: () => {
        console.log("Model edited successfully");
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
    ? dataModelos.filter((m: modelo) => m.brand.id === selectedBrandId)
    : dataModelos;

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
                {
                  modalMode === "addBrand" ? "Agregar Marca" :
                  modalMode === "addModel" ? "Agregar Modelo" :
                  modalMode === "editBrand" ? "Editar Marca" :
                  modalMode === "editModel" ? "Editar Modelo" :
                  ""
                }
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
               {
                  modalMode === "addBrand" ? "Introduce los datos de la marca" :
                  modalMode === "addModel" ? "Introduce los datos del modelo" :
                  modalMode === "editBrand" ? "Edita los datos de la marca" :
                  modalMode === "editModel" ? "Edita los datos del modelo" :
                  ""
                }
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <Input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className="mb-4" placeholder={(modalMode === "addBrand" || modalMode === "editBrand") ? "Nombre de la marca" : "Nombre del modelo"}/>
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
                onClick={handleAddEdithClick}
                type="button"
                className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto ${modalMode === "addBrand" || modalMode === "addModel" ? "bg-brand-500 hover:bg-brand-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {(modalMode === "addBrand" || modalMode === "addModel")? "Add" : "Edit"}
              </button>
            </div>
            {(isAddingBrand || isAddingModel) && (
              <div className="flex justify-center absolute bottom-5 left-5/11">
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
            {(isAddingBrandError || isAddingModelError) && (
              <motion.div 
                initial={{  x: 100 }} // Empieza invisible y 20px abajo
                animate={{  x: 0 }}  // Termina visible y en su posición
                transition={{ duration: 0.3 }}  // Duración de medio segundo
                className="absolute w-[50%] bottom-[2%] left-[25%]"
              >
                <div className="max-w-75">
                  <Alert
                    title="Error de conexion"
                    message={(addingBrandError?.message) || addingModelError?.message || "Error al agregar el registro."}
                    variant={"error"}
                   />
                </div>
                
              </motion.div>
            )}
          </div>
      </Modal>
      <div className="flex gap-10 justify-center">
          <div className="w-full">
            <div className="flex justify-end gap-3 text-xs pb-3" >
              <Button 
                onClick={() => handleclick("addBrand")} 
                startIcon={<AddIcon />} 
                variant={'primary'} 
                size="xs">
                <span className="text-white">Add</span>
              </Button>
            </div>
              <StandardTable<marca> editBtn={(id) => handleclick("editBrand",id)} deleteBtn={true} selectRowId={selectedBrandId} onRowSelect={onRowSelectedBrandId} columns={columnsMarcas} data={dataMarca} />
          </div>
          <div className="w-full">
            <div className="flex justify-end gap-3 text-xs pb-3" >
              <Button 
                onClick={() => handleclick("addModel")} 
                startIcon={<AddIcon />} 
                variant={selectedBrandId ? 'primary' : 'outline'} 
                size="xs"
                disabled={!selectedBrandId} // Deshabilitar si no hay una marca seleccionada
                >
                <span className="text-white">Add</span>
              </Button>
            </div>
              <StandardTable<modelo> editBtn={(id) =>handleclick("editModel",id)} deleteBtn={true}  selectRowId={selectedModelId} onRowSelect={onRowSelectedModelId} columns={columnsModelos} data={modelosFiltrados} />
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
