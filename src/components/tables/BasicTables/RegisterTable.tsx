import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";
import  { useState } from "react";
import Badge from "../../ui/badge/Badge";
import concentralogo from "@/Assets/400x100_concentra.png";
import innovixlogo from "@/Assets/400x100_innovix.png";
import {AscIcon, DescIcon, UnsortedIcon} from "@/icons";      

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


const columns = [
  { accessorKey: "empresa", header: "Empresa",
    cell: ( { getValue }: { getValue: () => string } )=>{
        const value = getValue();
        return value === "Innovix" ? <img width={100} src={innovixlogo} alt="Innovix" /> : <img width={100} src={concentralogo} alt="Concentra" />  ;
      }
  },
  { accessorKey: "tipo", header: "Tipo", 
    cell: ( { getValue }: { getValue: () => string } )=>{
    const value = getValue();
    return value === "Asignacion" ? <Badge size="sm" color="success">{value}</Badge> : <Badge size="sm" color="warning">{value}</Badge>;
  }},
  { accessorKey: "equipo", header: "Equipo" },
  { accessorKey: "firmante", header: "Firmante" },
  { accessorKey: "responsable", header: "Responsable" },
  { accessorKey: "fecha", header: "Fecha" },
];

export default function RegisterTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
            <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Filtrar..."
                className="border-none focus:outline-none outline:none p-1 mb-2 px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
            />
            <table className="min-w-full border-collapse">

            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                
                {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id}>
                    {hg.headers.map((header) => (
                        <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}   
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                        >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                            asc: <AscIcon className="inline-block w-4 h-4 ml-1 font-medium text-gray-500 text-start text-theme-xs dark:text-red-500 cursor-pointer" />,
                            desc: <DescIcon className="inline-block w-4 h-4 ml-1 font-medium text-gray-500 text-start text-theme-xs dark:text-red-500 cursor-pointer" />,
                        }[header.column.getIsSorted() as string] ?? <UnsortedIcon className="inline-block w-4 h-4 ml-1 font-medium text-gray-500 text-start text-theme-xs dark:text-white cursor-pointer" />}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-600 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                            <td
                            key={cell.id}
                            className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400"
                            >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};