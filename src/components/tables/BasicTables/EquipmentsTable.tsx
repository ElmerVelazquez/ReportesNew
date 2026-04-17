import Badge from "../../ui/badge/Badge";
import { BadgeColor } from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { getEquipments } from "@/api/index";
import { useQuery } from "@tanstack/react-query";
import Alert from "@/components/ui/alert/Alert";
import { motion } from "framer-motion";


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
      let color: BadgeColor = status === "En servicio" ? "success" : status === "Fuera de servicio" ? "error" : "light";

      return <Badge size="sm" color={color}>{status}</Badge>;
    }

  },
  { accessorKey: "nota", header: "Nota" },
];
interface EquipmentTableProps {
  selectedRowId: string | null;
  onRowSelect: (id: string | null) => void;

}
export default function EquipmentTable({ selectedRowId, onRowSelect }: EquipmentTableProps) {
    const { data: data = [], isLoading: loading, isError: error, refetch: refetch } = useQuery({
      queryKey: ["Equipments"],
      queryFn: getEquipments,
      select: (res) => res.data,
      staleTime: 1000 * 60, // 1 minuto
    });

  return (
    <>
      <StandardTable<itemProps>  selectRowId={selectedRowId} onRowSelect={onRowSelect} columns={columns} data={data} />
      {loading && (
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
      {(error) && (
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
              onClick={refetch}
            />
          </motion.div>
        )}
    </>  
      
  );
};