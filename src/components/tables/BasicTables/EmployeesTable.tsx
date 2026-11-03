import { ColumnDef } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StandardTable from "@/components/ui/table/StandardTable";
import Badge, { BadgeColor } from "@/components/ui/badge/Badge";
import { FetchAlert } from "@/components/ui/alert/FetchAlert";
import { getEmployees, } from "@/api/Employee";
import { Employee,} from "@/types";


type EmployeeRow = Employee & {
  fullName: string;
  statusLabel: string;
};

const columns: ColumnDef<EmployeeRow>[] = [
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "lastname", header: "Apellido" },
  { accessorKey: "job_title", header: "Cargo" },
  {
    accessorKey: "statusLabel",
    header: "Estado",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      const color: BadgeColor = value === "Activo" ? "success" : "error";

      return (
        <Badge size="sm" color={color}>
          {value}
        </Badge>
      );
    },
  },
];

const getStatusLabel = (status: Employee["status"]) => (status === "active" ? "Activo" : "Inactivo");

export default function EmployeesTable({
  selectedRowId,
  onRowSelect,
}: {
  selectedRowId: string | null;
  onRowSelect: (id: string | null) => void;
}) {
  const queryClient = useQueryClient();

  const resetData = () => {
    queryClient.resetQueries({ queryKey: ["Employees"] });
  };

  const {
    data: dataEmployees = [],
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    error: errorEmployees,
  } = useQuery({
    queryKey: ["Employees"],
    queryFn: getEmployees,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const dataMapped: EmployeeRow[] = dataEmployees.map((employee: Employee) => ({
    ...employee,
    fullName: `${employee.name} ${employee.lastname}`.trim(),
    statusLabel: getStatusLabel(employee.status),
  }));


  return (
    <>
      <StandardTable<EmployeeRow>
        selectRowId={selectedRowId}
        onRowSelect={onRowSelect}
        columns={columns}
        data={dataMapped}
      />

      <FetchAlert
        isPending={isLoadingEmployees}
        isError={isErrorEmployees}
        error={errorEmployees}
        onReset={resetData}
        variant="toast"
      />
    </>
  );
}
