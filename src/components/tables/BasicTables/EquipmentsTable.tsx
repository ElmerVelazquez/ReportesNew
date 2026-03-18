import Badge from "../../ui/badge/Badge";
import concentralogo from "@/Assets/400x100_concentra.png";
import innovixlogo from "@/Assets/400x100_innovix.png";
import StandardTable from "@/components/ui/table/standardTable";
import {
  ColumnDef,
} from "@tanstack/react-table";


type itemProps = {
  id: number,
  empresa: "Innovix" | "Concentra",
  tipo: "Asignacion" | "Entrega",
  equipo: "Laptop" | "Flota" | "Monitor" | "Mouse" | "Teclado" | "Chip",
  firmante: string,
  responsable: string,
  fecha: string,
}; 
const data: itemProps[] = 
 [
  {
    id: 1,
    empresa: "Concentra",
    tipo: "Asignacion",
    equipo: "Laptop",
    firmante: "Elmer",
    responsable: "Redes",
    fecha: "2025-11-05"
  },
  {
    id: 2,
    empresa: "Innovix",
    tipo: "Entrega",
    equipo: "Monitor",
    firmante: "Ana",
    responsable: "Soporte",
    fecha: "2025-11-10"
  }

]

const columns: ColumnDef<itemProps>[] = [
  { accessorKey: "empresa", header: "Empresa",
    cell: ( { getValue })=>{
        const value = getValue<"Innovix" | "Concentra">();
        return value === "Innovix" ? <img width={100} src={innovixlogo} alt="Innovix" /> : <img width={100} src={concentralogo} alt="Concentra" />  ;
      }
  },
  { accessorKey: "tipo", header: "Tipo", 
    cell: ( { getValue } )=>{
    const value = getValue<"Asignacion" | "Entrega">();
    return value === "Asignacion" ? <Badge size="sm" color="success">{value}</Badge> : <Badge size="sm" color="warning">{value}</Badge>;
  }},
  { accessorKey: "equipo", header: "Equipo" },
  { accessorKey: "firmante", header: "Firmante" },
  { accessorKey: "responsable", header: "Responsable" },
  { accessorKey: "fecha", header: "Fecha" },
];

export default function EquipmentTable() {
  

  return (
    <>
<StandardTable<itemProps> columns={columns} data={data} />
    </>
  );
};