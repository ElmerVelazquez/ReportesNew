import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";
import  { useState } from "react";
import {AscIcon, DescIcon, UnsortedIcon} from "@/icons";      


interface StandardTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]; // definición de columnas
  data: TData[];                    // filas de datos
}

export default function StandardTable<TData>({columns, data}: StandardTableProps<TData>) {
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