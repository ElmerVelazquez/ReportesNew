import {
  ColumnDef,
} from "@tanstack/react-table";
import StandardTable from "@/components/ui/table/StandardTable";
import { getEquipmentBrand, createEquipmentBrand, updateEquipmentBrand, deleteEquipmentBrand } from "@/api/EquipmentBrand";
import { createEquipmentModel, deleteEquipmentModel, getEquipmentTModel, updateEquipmentModel } from "@/api/EquipmentModel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddIcon } from "@/icons/index";
import Button from "@/components/ui/button/Button"; 
import Alert from "@/components/ui/alert/Alert";
import { motion} from "framer-motion";
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
type modalMode = "addBrand" | "addModel" | "editBrand" | "editModel" | "deleteBrand" | "deleteModel"; 


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
    const [resourceId, setEdithId] = useState<string | null>(null);

    const handleclick = (mode: modalMode, id?: string | null) => {
      setModalMode(mode);
      setEdithId(id || null);
      openModal();
    }
    const handleModalClose = () => {
      setInputValue("");
      setEdithId(null);
      closeModal();
    }
    const resetData = () => {
      console.log("Data refetched");
      queryClient.resetQueries({ queryKey: ["EquipmentModels"] });
      queryClient.resetQueries({ queryKey: ["EquipmentBrands"] });

    }
    const resetMutations = () => {
      resetAddBrand();
      resetAddModel();
      resetEditBrand();
      resetEditModel();
      resetDeleteBrand();
      resetDeleteModel();
    } 


    const handleModalAction = () => {
      if (modalMode === "addBrand") {
        // Lógica para agregar marca
        addBrand({ name: inputValue });
        setInputValue(""); // Aquí deberías reemplazar con los datos reales del formulario
      }else if (modalMode === "addModel") {
        addModel({ name: inputValue, equipment_brand_id: Number(selectedBrandId) }); // Aquí deberías reemplazar con los datos reales del formulario
        setInputValue("");
      }else if (modalMode === "editBrand") {
        editBrand( {id: Number(resourceId), name: inputValue} ); // Lógica para editar marca
        console.log("Edit brand with id:", resourceId, "and new name:", inputValue);
      }else if (modalMode === "editModel") {
        editModel( {id: Number(resourceId), name: inputValue} ); // Lógica para editar modelo
        console.log("Edit model with id:", resourceId, "and new name:", inputValue);
      }else if (modalMode === "deleteBrand") {
        deleteBrand(Number(resourceId)); // Lógica para eliminar marca
        setInputValue("");
        console.log("Delete brand with id:", resourceId);
      }else if (modalMode === "deleteModel") {
        deleteModel(Number(resourceId)); // LógicsetInputValue("");a para eliminar modelo
        setInputValue("");
        console.log("Delete model with id:", resourceId);
      }

    }

    const { mutate: addBrand, isPending: isAddingBrand, isError: isAddingBrandError, error: addingBrandError, reset: resetAddBrand } = useMutation({
      mutationFn: createEquipmentBrand,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });

      }
    });
    const { mutate: addModel, isPending: isAddingModel, isError: isAddingModelError, error: addingModelError, reset: resetAddModel } = useMutation({
      mutationFn: createEquipmentModel,
      onSuccess: () => {
        console.log("Model added successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      }
    });
    const { mutate: editBrand, isPending: isEditingBrand, isError: isEditingBrandError, error: editingBrandError, reset: resetEditBrand } = useMutation({
      mutationFn: updateEquipmentBrand,
      onSuccess: () => {
        console.log("Brand edited successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
        closeModal();

      }
    });
    const { mutate: editModel, isPending: isEditingModel, isError: isEditingModelError, error: editingModelError, reset: resetEditModel } = useMutation({
      mutationFn: updateEquipmentModel,
      onSuccess: () => {
        console.log("Model edited successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
        closeModal();
      }
    });

    const {mutate : deleteBrand, isPending: isDeletingBrand, isError: isDeletingBrandError, error: deletingBrandError, reset: resetDeleteBrand} = useMutation({
      mutationFn: deleteEquipmentBrand, // Aquí deberías implementar la función para eliminar la marca
      onSuccess: () => {
        console.log("Brand deleted successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
        closeModal();

      }
    });
    const {mutate : deleteModel, isPending: isDeletingModel, isError: isDeletingModelError, error: deletingModelError, reset: resetDeleteModel} = useMutation({
      mutationFn: deleteEquipmentModel, // Aquí deberías implementar la función para eliminar el modelo
      onSuccess: () => {
        console.log("Model deleted successfully");
        queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
        closeModal();

      }
    });

    const { data: dataMarca = [], isLoading: loadingMarcas, isError: isErrorMarcas, error: errorMarcas } = useQuery({
      queryKey: ["EquipmentBrands"],
      queryFn: getEquipmentBrand,
      select: (res) => res.data,
      staleTime: 1000 * 60, // 1 minuto
    });

    const { data: dataModelos = [], isLoading: loadingModelos, isError: isErrorModelos, error: errorModelos } = useQuery({
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
          onClose={handleModalClose}
          className={"p-6 lg:p-10" + ( (modalMode === "deleteBrand" || modalMode === "deleteModel") ? " max-w-[400px]" : " max-w-[700px]")}
          showCloseButton={false}
          isblurred={false}
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
                <p className={" text-gray-500 dark:text-gray-400" + ((modalMode === "deleteBrand" || modalMode === "deleteModel") ? " text-center text-md" : " text-sm")}>
                {
                    modalMode === "addBrand" ? "Introduce los datos de la marca" :
                    modalMode === "addModel" ? "Introduce los datos del modelo" :
                    modalMode === "editBrand" ? "Edita los datos de la marca" :
                    modalMode === "editModel" ? "Edita los datos del modelo" :
                    modalMode === "deleteBrand" ? "¿Estás seguro de que deseas eliminar esta marca?" :
                    modalMode === "deleteModel" ? "¿Estás seguro de que deseas eliminar este modelo?" :
                    ""
                  }
                </p>
              </div>
              {(modalMode === "addBrand" || modalMode === "addModel" || modalMode === "editBrand" || modalMode === "editModel") && (
                <div className="mt-8">
                  <Input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className="mb-4" placeholder={(modalMode === "addBrand" || modalMode === "editBrand") ? "Nombre de la marca" : "Nombre del modelo"}/>
                </div>
              )}
              <div className={"flex items-center gap-3 mt-6 modal-footer "+( (modalMode === "deleteBrand" || modalMode === "deleteModel" ) ? "justify-center gap-10" : "sm:justify-end")}>
                <button
                  onClick={handleModalClose}
                  type="button"
                  className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                >
                  Close
                </button>
                <button
                  onClick={handleModalAction}
                  type="button"
                  className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto 
                    ${modalMode === "addBrand" || modalMode === "addModel" ? "bg-brand-500 hover:bg-brand-600" : 
                      modalMode === "editBrand" || modalMode === "editModel" ? "bg-green-500 hover:bg-green-600":
                      modalMode === "deleteBrand" || modalMode === "deleteModel" ? "bg-red-500 hover:bg-red-600":""}`}
                >
                  {(modalMode === "addBrand" || modalMode === "addModel")? "Add" :
                  (modalMode === "editBrand" || modalMode === "editModel")? "Edit" :
                  (modalMode === "deleteBrand" || modalMode === "deleteModel")? "Delete" :
                  ""}
                </button>
              </div>
              {(isAddingBrand || isAddingModel || isEditingBrand || isEditingModel || isDeletingBrand || isDeletingModel ) && (
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
              {(isAddingBrandError || isAddingModelError || isEditingBrandError || isEditingModelError || isDeletingBrandError || isDeletingModelError ) && (
                <motion.div 
                  initial={{  x: 100 }} // Empieza invisible y 20px abajo
                  animate={{  x: 0 }}  // Termina visible y en su posición
                  transition={{ duration: 0.3 }}  // Duración de medio segundo
                  className="absolute w-[50%] bottom-[2%] left-[25%]"
                >
                  <div className="max-w-75">
                    <Alert
                      title="Error de conexion"
                      message={(addingBrandError?.message) || addingModelError?.message || editingBrandError?.message || editingModelError?.message || deletingBrandError?.message || deletingModelError?.message || "Error al agregar el registro."}
                      variant={"error"}
                      onClick={resetMutations}
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
              <StandardTable<marca> editBtn={(id) => handleclick("editBrand",id)} deleteBtn={(id) => handleclick("deleteBrand",id)} selectRowId={selectedBrandId} onRowSelect={onRowSelectedBrandId} columns={columnsMarcas} data={dataMarca} />
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
              <StandardTable<modelo> editBtn={(id) =>handleclick("editModel",id)} deleteBtn={(id) =>handleclick("deleteModel",id)}  selectRowId={selectedModelId} onRowSelect={onRowSelectedModelId} columns={columnsModelos} data={modelosFiltrados} />
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
      {(isErrorMarcas || isErrorModelos) && (
        <motion.div 
          initial={{  x: 100 }} // Empieza invisible y 20px abajo
          animate={{  x: 0 }}  // Termina visible y en su posición
          transition={{ duration: 0.3 }}  // Duración de medio segundo
          className="absolute w-[50%] bottom-[2%] left-[25%]"
        >
          <Alert
            title="Error de conexion"
            message={"Error al obtener los datos: " + (errorMarcas?.message || errorModelos?.message || "Error desconocido.")}
            variant={"error"}
            onClick={resetData}
          />
        </motion.div>
      )}
    </>
  );
};
