import {
  ColumnDef,
} from "@tanstack/react-table";
import StandardTable from "@/components/ui/table/StandardTable";
import { getEquipmentBrand } from "@/api/EquipmentBrand";
import { getEquipmentTModel } from "@/api/EquipmentModel";
import { useQuery } from "@tanstack/react-query";
import { AddIcon } from "@/icons/index";
import { TrashBinIcon } from "@/icons/index";
import Button from "@/components/ui/button/Button"; 
import Alert from "@/components/ui/alert/Alert";
import { motion } from "framer-motion";


type marca = {
  id?: number,
  nombre: string,
}; 
type modelo = {
  id: number,
  nombre: string,
  brand: {
    id: number,
    name: string
  }
}; 
// const dataMarca: marca[] = 
//  [
//   {
//     id: 1,
//     nombre: "Dell"
//   },
//   {
//     id: 2,
//     nombre: "HP"
//   }
// ]
// const dataModelos: modelo[] = 
// [
//   {
//     id: 1,
//     nombre: "XPS",
//     marca_id: 1
//   },
//   {
//     id: 2,
//     nombre: "ideapad",
//     marca_id: 2
//   }
// ]

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

  return (
    <>
      <div className="flex gap-10 justify-center">
          <div className="w-full">
            <div className="flex justify-end gap-3 text-xs pb-3" >
              <Button 
                onClick={() => {}} 
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
                onClick={() => {}} 
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
