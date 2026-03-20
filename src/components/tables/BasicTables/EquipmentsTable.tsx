import Badge from "../../ui/badge/Badge";
import { BadgeColor } from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import {
  ColumnDef,
} from "@tanstack/react-table";


type itemProps = {
  id: number,
  equipo: string,
  marca: string,
  modelo: string,
  serial: string,
  estatus: "En servicio" | "Fuera de servicio" | "Disponible",
  nota: string,
}; 
const data: itemProps[] = 
 [
  {
    id: 1,
    equipo: "Laptop",
    marca: "Dell",
    modelo: "XPS 13",
    serial: "xps13-2021-001",
    estatus: "En servicio",
    nota: "En buen estado"
  }

]

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

export default function EquipmentTable() {
  

  return (
      <StandardTable<itemProps> columns={columns} data={data} />
  );
};