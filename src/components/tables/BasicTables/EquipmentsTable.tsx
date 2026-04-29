import Badge from "../../ui/badge/Badge";
import { BadgeColor } from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import {ColumnDef} from "@tanstack/react-table";
import { getEquipment } from "@/api/Equipment";
import { getEquipmentTypes } from "@/api/EquipmentType";
import { getEquipmentBrand } from "@/api/EquipmentBrand";
import { getEquipmentTModel } from "@/api/EquipmentModel";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Alert from "@/components/ui/alert/Alert";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import {marca, modelo, StatusEquipo, Equipo} from "@/types";
import { useEffect, useState } from "react";
import { getEquipmentStatus } from "@/api/EquipmentStatus";
import { createEquipment, deleteEquipment, updateEquipment } from "@/api/Equipment";


const columns: ColumnDef<Equipo>[] = [
  { accessorKey: "equipment", header: "Equipo"},
  { accessorKey: "brand", header: "Marca" },
  { accessorKey: "model", header: "Modelo" },
  { accessorKey: "serial", header: "Serial" },
  { accessorKey: "status", header: "Estatus", 
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const color: BadgeColor = status === "En servicio" ? "primary" : status === "Fuera de servicio" ? "error" : "light";

      return <Badge size="sm" color={color}>{status}</Badge>;
    }
  },
  { accessorKey: "note", header: "Nota",
    cell: ({ getValue }) => {
      const note = getValue<string>();
      return (
        <span className="max-w-[200px] block truncate">
          {note}
        </span>
      );
    }
    }
];

interface EquipmentTableProps {
  selectedRowId: string | null;
  onRowSelect: (id: string | null) => void;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}
type modalMode = "addEquipment" | "editEquipment" | "deleteEquipment";

export default function EquipmentTable({ selectedRowId, onRowSelect, isOpen, closeModal, openModal }: EquipmentTableProps) {
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState<modalMode>("addEquipment");
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState("1");
  const [typeValue, setTypeValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [serialValue, setSerialValue] = useState("");
  const [commentValue, setCommentValue] = useState("");

  const handleclick = (mode: modalMode, id?: string | null) => {
      setModalMode(mode);
      setResourceId(id || null);
      openModal();
      console.log("Clicked", mode, id,"status:", statusValue," type:", typeValue, "brand:", brandValue, "model:", modelValue, "serial:", serialValue, "comment:", commentValue);
    }
  const resetData = () => {
      console.log("Data refetched");
      queryClient.resetQueries({ queryKey: ["EquipmentModels"] });
      queryClient.resetQueries({ queryKey: ["EquipmentBrands"] });
      queryClient.resetQueries({ queryKey: ["EquipmentTypes"] });
      queryClient.resetQueries({ queryKey: ["EquipmentStatus"] });
      queryClient.resetQueries({ queryKey: ["Equipments"] });
  };

  const resetMutations = () => {
    resetAddEquipment();
    resetUpdateEquipment();
    resetDeleteEquipment();
  }
  const handleModalClose = () => {
    closeModal();
    setStatusValue("1");
    setTypeValue("");
    setBrandValue("");
    setModelValue("");
    setSerialValue("");
    setCommentValue("");
    setResourceId(null);
    resetMutations();
  }
  const handleModalAction = () => {
    if(modalMode === "addEquipment") {
      addEquipment({equipment_type_id: Number(typeValue),equipment_brand_id: Number(brandValue),equipment_model_id: Number(modelValue), equipment_status_id: Number(statusValue), serial: serialValue, comment: commentValue});
    } else if(modalMode === "editEquipment" && resourceId) {
      editEquipment({id: Number(resourceId), equipment_type_id: Number(typeValue),equipment_brand_id: Number(brandValue),equipment_model_id: Number(modelValue), equipment_status_id: Number(statusValue), serial: serialValue, comment: commentValue});
    } else if(modalMode === "deleteEquipment" && resourceId) {
      deleteEquipmentData(resourceId);
    }
  }

  const { mutate: addEquipment, isPending: isAddingEquipment, isError: isAddingEquipmentError, error: addingEquipmentError, reset: resetAddEquipment } = useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
    }
  });
  const { mutate: editEquipment, isPending: isEditingEquipment, isError: isEditingEquipmentError, error: editingEquipmentError, reset: resetUpdateEquipment } = useMutation({
    mutationFn: updateEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
    } 
  });
  const { mutate: deleteEquipmentData, isPending: isDeletingEquipment, isError: isDeletingEquipmentError, error: deletingEquipmentError, reset: resetDeleteEquipment } = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
    } 
  });
  const { data: dataEquipments = [], isLoading: isLoadingEquipments, isError: isErrorEquipments, error: errorEquipments } = useQuery({
    queryKey: ["Equipments"],
    queryFn: getEquipment,
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1 minuto
  });
  const { data: dataEquipmentStatus = [], isLoading: isLoadingEquipmentStatus, isError: isErrorEquipmentStatus, error: errorEquipmentStatus } = useQuery({
    queryKey: ["EquipmentStatus"],
    queryFn: getEquipmentStatus,
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1 minuto
  });
  const { data: dataEquipmentTypes = []} = useQuery({
    queryKey: ["EquipmentTypes"],
    queryFn: getEquipmentTypes,
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1 minuto
  });
  const { data: dataMarca = [], isLoading: isLoadingMarcas, isError: isErrorMarcas, error: errorMarcas } = useQuery({
    queryKey: ["EquipmentBrands"],
    queryFn: getEquipmentBrand,
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1 minuto
  });
  const { data: dataModelos = [], isLoading: isLoadingModelos, isError: isErrorModelos, error: errorModelos } = useQuery({
    queryKey: ["EquipmentModels"],
    queryFn: getEquipmentTModel,
    select: (res) => res.data,
    staleTime: 1000 * 60, // 1 minuto
  });
  const dataMapped = dataEquipments.map((equipment: Equipo) => ({
    id: equipment.id,
    equipment: equipment.type.name,
    brand: equipment.brand.name,
    model: equipment.model.name,
    serial: equipment.serial,
    status: equipment.status.name,
    note: equipment.comment
  }));

  const equipmentTypesOptions = dataEquipmentTypes.map((type: { id: number; name: string }) => ({
    value: type.id.toString(),
    label: type.name,
  }));
  const marcaOptions = dataMarca.map((marca: marca) => ({
    value: marca.id.toString(),
    label: marca.name,
  }));
  const modeloFiltered = dataModelos.filter((modelo: modelo) => {
    return String(modelo.brand.id) === brandValue
  });
  const modeloOptions = modeloFiltered.map((modelo: modelo) => ({
    value: modelo.id.toString(),
    label: modelo.name,
  }));
  useEffect(() => {
    if(modalMode === "editEquipment" && resourceId && isOpen) {
      const dat = dataEquipments.find((e: Equipo)=>e.id===Number(resourceId));
        console.log("equipment: ", dat);
        setStatusValue(String(dat.status.id));
        setTypeValue(String(dat.type.id));
        setBrandValue(String(dat.brand.id));
        setModelValue(String(dat.model.id));
        setSerialValue(dat.serial);
        setCommentValue(dat.comment);
    }
  }, [modalMode, resourceId, isOpen, dataEquipments]);

  return (
    <>
    <Modal
          isOpen={isOpen}
          onClose={handleModalClose}
          showCloseButton={false}
          isblurred={false}
          className={"p-6 lg:p-10" + ( (modalMode === "deleteEquipment") ? " max-w-[400px]" : " max-w-[700px]")}
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                  {
                    modalMode === "addEquipment" ? "Agregar Equipo" :
                    modalMode === "editEquipment" ? "Editar Equipo" :
                    ""
                  }
                </h5>
              <p className={" text-gray-500 dark:text-gray-400" + ((modalMode === "deleteEquipment") ? " text-center text-md" : " text-sm")}>
                  {
                    modalMode === "addEquipment" ? "Introduce los datos del equipo" :
                    modalMode === "editEquipment" ? "Edita los datos del equipo" :
                    modalMode === "deleteEquipment" ? "¿Estás seguro de que deseas eliminar este equipo?" :
                    ""                
                  }
              </p>
            </div>
            <div className="mt-8">
              <div>
                {(modalMode === "addEquipment" || modalMode === "editEquipment") && (
                <div>
                  <div className="flex gap-6 mb-5">
                    {dataEquipmentStatus.map((status: StatusEquipo) => (
                      <Radio 
                        key={status.id}
                        id={`rad${status.id}`}
                        name="rad1"
                        label={status.name}
                        value={status.id.toString()}
                        checked={statusValue === String(status.id)}
                        onChange={() => setStatusValue(String(status.id))}
                      />
                    ))}
                  </div>
                  <Select options={equipmentTypesOptions} placeholder="Tipo de equipo" value={typeValue} onChange={(value) => setTypeValue(value)} className="dark:bg-dark-900 mb-4"/>
                  <Select options={marcaOptions} placeholder="Marca" value={brandValue} onChange={(value) => {setBrandValue(value)}} className="dark:bg-dark-900 mb-4"/>
                  <Select options={modeloOptions} placeholder="Modelo" value={modelValue} onChange={(value) => {setModelValue(value)}} className="dark:bg-dark-900 mb-4"/>
                  <Input className="mb-4" placeholder="Serial" value={serialValue} onChange={(e) => setSerialValue(e.target.value)}/>
  
                  <TextArea placeholder="Nota" rows={4} className="mb-4"  value={commentValue} onChange={(value) => setCommentValue(value)}/>
                  
                </div>
                )}
              </div>
            </div>
            <div className={"flex items-center gap-3 mt-6 modal-footer "+( (modalMode === "deleteEquipment") ? "justify-center gap-10" : "sm:justify-end")}>
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleModalAction}
                className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto 
                    ${modalMode === "addEquipment"? "bg-brand-500 hover:bg-brand-600" : 
                      modalMode === "editEquipment"? "bg-green-500 hover:bg-green-600":
                      modalMode === "deleteEquipment"? "bg-red-500 hover:bg-red-600":""}`}
                >
                {(modalMode === "addEquipment")? "Add" :
                  (modalMode === "editEquipment")? "Edit" :
                  (modalMode === "deleteEquipment")? "Delete" :
                  ""}
              </button>
            </div>
            {(isAddingEquipment || isEditingEquipment || isDeletingEquipment) && (
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
            {(isAddingEquipmentError || isEditingEquipmentError || isDeletingEquipmentError) && (
                <motion.div 
                  initial={{  x: 100 }} // Empieza invisible y 20px abajo
                  animate={{  x: 0 }}  // Termina visible y en su posición
                  transition={{ duration: 0.3 }}  // Duración de medio segundo
                  className="absolute w-[50%] bottom-[2%] left-[25%]"
                >
                  <div className="max-w-75">
                    <Alert
                      title="Error de conexion"
                      message={addingEquipmentError?.message || editingEquipmentError?.message || deletingEquipmentError?.message || "Error al agregar el registro."}
                      variant={"error"}
                      onClick={resetMutations}
                    />
                  </div>
                  
                </motion.div>
              )}
          </div>
      </Modal>

      <StandardTable<Equipo> selectRowId={selectedRowId} onRowSelect={onRowSelect} columns={columns} data={dataMapped} editBtn={(id)=>handleclick("editEquipment", id)} deleteBtn={(id)=>handleclick("deleteEquipment", id)} />
      {(isLoadingEquipments || isLoadingMarcas || isLoadingModelos || isLoadingEquipmentStatus) && (
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
      {(isErrorEquipments || isErrorMarcas || isErrorModelos || isErrorEquipmentStatus) && (
          <motion.div 
            initial={{  x: 100 }} // Empieza invisible y 20px abajo
            animate={{  x: 0 }}  // Termina visible y en su posición
            transition={{ duration: 0.3 }}  // Duración de medio segundo
            className="absolute w-[50%] bottom-[2%] left-[25%]"
          >
            <Alert
              title="Error de conexion"
              message={"Error: " + errorEquipments?.message || errorMarcas?.message || errorModelos?.message || errorEquipmentStatus?.message || "Error desconocido"}
              variant={"error"}
              onClick={resetData}
            />
          </motion.div>
        )}
    </>  
      
  );
};