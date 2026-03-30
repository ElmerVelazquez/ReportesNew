import {
  ColumnDef,
} from "@tanstack/react-table";
import StandardTable from "@/components/ui/table/StandardTable";
import { useEffect, useState } from "react";
import { getEquipmentBrand } from "@/api/EquipmentBrand";
import { getEquipmentTModel } from "@/api/EquipmentModel";


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
    const [dataMarca,setDataMarca]= useState<marca[]>([]);
    const [dataModelos,setDataModelos]= useState<modelo[]>([]);
    const modelosFiltrados = selectedBrandId
    ? dataModelos.filter(m => m.brand.id === Number(selectedBrandId)+1)
    : dataModelos;

    useEffect(()=>{
        const loadData = async () => {
            const [brandsRes, modelsRes] = await Promise.all([
            getEquipmentBrand(),
            getEquipmentTModel(),
            ]);
            setDataMarca(brandsRes.data);
            setDataModelos(modelsRes.data);
        };
        loadData();
    },[])
console.log("modelos filtrados", dataModelos);
  return (
    <div className="flex gap-10 justify-center">
        <div className="w-full">
            <StandardTable<marca>  selectRowId={selectedBrandId} onRowSelect={onRowSelectedBrandId} columns={columnsMarcas} data={dataMarca} />
        </div>
        <div className="w-full">
            <StandardTable<modelo>  selectRowId={selectedModelId} onRowSelect={onRowSelectedModelId} columns={columnsModelos} data={modelosFiltrados} />
        </div>
    </div>
  );
};
