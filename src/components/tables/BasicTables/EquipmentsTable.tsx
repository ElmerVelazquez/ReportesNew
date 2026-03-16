import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import logoConcentra from '@/Assets/400x100_concentra.png'
import logoInnovix from '@/Assets/400x100_innovix.png'


import Badge from "../../ui/badge/Badge";

export type itemProps = {
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



// Define the table data using the interface

export default function EquipmentTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Empresa
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tipo
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Equipo
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Firmante
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Responsable
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Fecha
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-30 h-10 overflow-hidden rounded-full">
                      <img
                        width={200}
                        height={40}
                        src={item.empresa === "Concentra" ? logoConcentra : logoInnovix}
                        alt={item.empresa}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                    size="sm"
                    color={
                      item.tipo === "Asignacion"
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="flex -space-x-2">
                    {item.equipo}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.firmante}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.responsable}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.fecha}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
