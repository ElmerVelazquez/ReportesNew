import Badge from "../../ui/badge/Badge";
import { BadgeColor } from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import {ColumnDef} from "@tanstack/react-table";
import { getEquipments } from "@/api/index";
import { getEquipmentTypes } from "@/api/EquipmentType";
import { getEquipmentBrand } from "@/api/EquipmentBrand";
import { getEquipmentTModel } from "@/api/EquipmentModel";
import { useQuery } from "@tanstack/react-query";
import Alert from "@/components/ui/alert/Alert";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { useState } from "react";

type itemProps = {
  id: string,
  equipo: string,
  marca: string,
  modelo: string,
  serial: string,
  estatus: "En servicio" | "Fuera de servicio" | "Disponible",
  nota: string,
}; 

const columns: ColumnDef<itemProps>[] = [
  { accessorKey: "equipo", header: "Equipo"},
  { accessorKey: "marca", header: "Marca" },
  { accessorKey: "modelo", header: "Modelo" },
  { accessorKey: "serial", header: "Serial" },
  { accessorKey: "estatus", header: "Estatus", 
    cell: ({ getValue }) => {
      const status = getValue<itemProps["estatus"]>();
      const color: BadgeColor = status === "En servicio" ? "success" : status === "Fuera de servicio" ? "error" : "light";

      return <Badge size="sm" color={color}>{status}</Badge>;
    }
  },
  { accessorKey: "nota", header: "Nota" },
];
interface EquipmentTableProps {
  selectedRowId: string | null;
  onRowSelect: (id: string | null) => void;
  isOpen: boolean;
  closeModal: () => void;
}
export default function EquipmentTable({ selectedRowId, onRowSelect, isOpen, closeModal }: EquipmentTableProps) {
  const [selectedOption, setSelectedOption] = useState("1");
  
  const { data: dataEquipments = [], isLoading: isLoadingEquipments, isError: isErrorEquipments, error: errorEquipments } = useQuery({
    queryKey: ["Equipments"],
    queryFn: getEquipments,
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
  const equipmentTypesOptions = dataEquipmentTypes.map((type: { id: number; name: string }) => ({
    value: type.id.toString(),
    label: type.name,
  }));
  const marcaOptions = dataMarca.map((marca: { id: number; name: string }) => ({
    value: marca.id.toString(),
    label: marca.name,
  }));
  const modeloOptions = dataModelos.map((modelo: { id: number; name: string }) => ({
    value: modelo.id.toString(),
    label: modelo.name,
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
                  <Select options={equipmentTypesOptions} placeholder="Tipo de equipo" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  <Select options={marcaOptions} placeholder="Marca" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
                  <Select options={modeloOptions} placeholder="Modelo" onChange={() => {}} className="dark:bg-dark-900 mb-4"/>
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

      <StandardTable<itemProps>  selectRowId={selectedRowId} onRowSelect={onRowSelect} columns={columns} data={dataEquipments} />
      {(isLoadingEquipments || isLoadingMarcas || isLoadingModelos) && (
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
      {(isErrorEquipments || isErrorMarcas || isErrorModelos) && (
          <motion.div 
            initial={{  x: 100 }} // Empieza invisible y 20px abajo
            animate={{  x: 0 }}  // Termina visible y en su posición
            transition={{ duration: 0.3 }}  // Duración de medio segundo
            className="absolute w-[50%] bottom-[2%] left-[25%]"
          >
            <Alert
              title="Error de conexion"
              message={"Error: " + errorEquipments?.message || errorMarcas?.message || errorModelos?.message || "Error desconocido"}
              variant={"error"}
            />
          </motion.div>
        )}
    </>  
      
  );
};