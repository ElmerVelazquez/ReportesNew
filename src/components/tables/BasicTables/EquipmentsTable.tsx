import { use, useEffect, useState } from "react";
import Badge from "../../ui/badge/Badge";
import { BadgeColor } from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { getEquipments } from "@/api/index";


type itemProps = {
  id: number,
  equipo: string,
  marca: string,
  modelo: string,
  serial: string,
  estatus: "En servicio" | "Fuera de servicio" | "Disponible",
  nota: string,
}; 
// const data: itemProps[] = 
//  [
//   {
//     id: 1,
//     equipo: "Laptop",
//     marca: "Dell",
//     modelo: "XPS 13",
//     serial: "xps13-2021-001",
//     estatus: "En servicio",
//     nota: "En buen estado"
//   },
//   {
//     id: 2,
//     equipo: "Laptop",
//     marca: "Dell",
//     modelo: "XPS 123",
//     serial: "xps13-2021-001",
//     estatus: "En servicio",
//     nota: "En buen estado"
//   }

// ]

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
    const [data, setData] = useState<itemProps[]>([]);
    useEffect(() => {
             getEquipments()
            .then((equipments) => {
                setData(equipments);
            })
            .catch((error) => {
                console.error("Error fetching equipments:", error);
            });
    }, []);


  return (  
      <StandardTable<itemProps>  selectRowId={selectedRowId} onRowSelect={onRowSelect} columns={columns} data={data} />
  );
};