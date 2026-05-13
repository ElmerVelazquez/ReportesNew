import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";
import  { useState } from "react";
import {AscIcon, DescIcon, UnsortedIcon,EditIcon, TrashBinIcon, AddIcon} from "@/icons";      
import Button from "../button/Button";


interface StandardTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]; // definición de columnas
  data: TData[];
  onRowSelect: (id: string | null) => void; // función para manejar la selección de filas
  selectRowId: string | null; // ID de la fila seleccionada
  editBtn?: undefined | ((arg: string | null) => void); // Si se muestra el botón de editar
  deleteBtn?: undefined | ((arg: string | null) => void); // Si se muestra el botón de eliminar
  addBtn?: undefined | (() => void); // Si se muestra el botón de agregar   
  isAddable?: boolean;
}
export default function StandardTable<TData extends { id: number }>({columns, data, onRowSelect, selectRowId, editBtn, deleteBtn, addBtn, isAddable=true}: StandardTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({pageIndex: 0,pageSize: 10,});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
            <div className="flex items-center justify-between">
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Filtrar..."
                    className="border-none focus:outline-none outline:none p-1 mb-2 px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer"
                />
                {addBtn &&
                <Button 
                    onClick={addBtn} 
                    startIcon={<AddIcon />} 
                    variant={isAddable ? 'primary' : 'outline'}
                    disabled={!isAddable} 
                    size="xs">
                <span className="text-white">Add</span>
              </Button>}
            </div>
            
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
                        <tr 
                            key={row.id}
                            onClick={() => onRowSelect(selectRowId === row.id ? null : row.id)} 
                            className={`hover:bg-gray-200 dark:hover:bg-gray-700 transition-color cursor-pointer ${selectRowId === row.id ? 'bg-gray-200 dark:bg-gray-600' : ''}`}   
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                key={cell.id}
                                className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400"
                                >
                                    <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                                </td>
                            ))}
                            <td>
                                <div className="flex justify-end items-center h-13 mr-3">
                                    {editBtn && <button onClick={() => editBtn(row.id)} className="text-blue-500 hover:text-blue-700"><EditIcon className="size-4" /></button>}
                                    {deleteBtn && <button onClick={() => deleteBtn(row.id)} className="text-red-500 hover:text-red-700 ml-2"><TrashBinIcon className="size-4" /></button>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between mt-4 dark:text-gray-400 dark:[&_button]:border-gray-200 [&_button]:border-gray-500">
                <div className="flex gap-2 ">
                    <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 border rounded disabled:opacity-30 "
                    >
                    {"<<"}
                    </button>
                    <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 border rounded disabled:opacity-30"
                    >
                    {"<"}
                    </button>
                    <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 border rounded disabled:opacity-30"
                    >
                    {">"}
                    </button>
                    <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-2 border rounded disabled:opacity-30"
                    >
                    {">>"}
                    </button>
                </div>

                <span className="flex items-center gap-1 text-sm">
                    <div>Página</div>
                    <strong>
                    {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </strong>
                </span>

                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="p-2 border rounded text-sm"
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize} className="dark:bg-gray-700 dark:text-color-gray-400">
                        Mostrar {pageSize}
                    </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
  );
};