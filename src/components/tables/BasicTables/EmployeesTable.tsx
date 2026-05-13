import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StandardTable from "@/components/ui/table/StandardTable";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Badge, { BadgeColor } from "@/components/ui/badge/Badge";
import { FetchAlert } from "@/components/ui/alert/FetchAlert";
import { CrudModal } from "@/components/ui/modal/CrudModal";
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/api/Employee";
import { Employee, EmployeeDto } from "@/types";
import { useResourceModal } from "@/hooks/useResourceModal";

type modalMode = "addEmployee" | "editEmployee" | "deleteEmployee";

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

const modalMeta: Record<
  modalMode,
  {
    title: string;
    description: string;
    actionLabel: string;
    compact: boolean;
    tone: "add" | "edit" | "delete";
  }
> = {
  addEmployee: {
    title: "Agregar Empleado",
    description: "Introduce los datos del empleado",
    actionLabel: "Add",
    compact: false,
    tone: "add",
  },
  editEmployee: {
    title: "Editar Empleado",
    description: "Edita los datos del empleado",
    actionLabel: "Edit",
    compact: false,
    tone: "edit",
  },
  deleteEmployee: {
    title: "Eliminar Empleado",
    description: "¿Estás seguro de que deseas eliminar este empleado?",
    actionLabel: "Delete",
    compact: true,
    tone: "delete",
  },
};

const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
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
  const { isOpen, modalMode, resourceId, openResourceModal, closeResourceModal } =
    useResourceModal<modalMode>("addEmployee");
  const [nameValue, setNameValue] = useState("");
  const [lastnameValue, setLastnameValue] = useState("");
  const [jobTitleValue, setJobTitleValue] = useState("");
  const [statusValue, setStatusValue] = useState<Employee["status"]>("active");

  const resetData = () => {
    queryClient.resetQueries({ queryKey: ["Employees"] });
  };

  const resetMutations = () => {
    resetAddEmployee();
    resetEditEmployee();
    resetDeleteEmployee();
  };

  const resetForm = () => {
    setNameValue("");
    setLastnameValue("");
    setJobTitleValue("");
    setStatusValue("active");
  };

  const handleModalClose = () => {
    onRowSelect(null);
    closeResourceModal();
    resetForm();
    resetMutations();
  };

  const handleModalAction = () => {
    const payload: EmployeeDto = {
      name: nameValue,
      lastname: lastnameValue,
      job_title: jobTitleValue,
      status: statusValue,
    };

    if (modalMode === "addEmployee") {
      addEmployee(payload);
      return;
    }

    if (modalMode === "editEmployee" && resourceId) {
      editEmployee({ id: Number(resourceId), ...payload });
      return;
    }

    if (modalMode === "deleteEmployee" && resourceId) {
      deleteEmployeeData(resourceId);
    }
  };

  const {
    mutate: addEmployee,
    isPending: isAddingEmployee,
    isError: isAddingEmployeeError,
    error: addingEmployeeError,
    reset: resetAddEmployee,
  } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Employees"] });
      handleModalClose();
    },
  });

  const {
    mutate: editEmployee,
    isPending: isEditingEmployee,
    isError: isEditingEmployeeError,
    error: editingEmployeeError,
    reset: resetEditEmployee,
  } = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Employees"] });
      handleModalClose();
    },
  });

  const {
    mutate: deleteEmployeeData,
    isPending: isDeletingEmployee,
    isError: isDeletingEmployeeError,
    error: deletingEmployeeError,
    reset: resetDeleteEmployee,
  } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Employees"] });
      handleModalClose();
    },
  });

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

  useEffect(() => {
    if (!isOpen) return;

    if (modalMode === "editEmployee" && resourceId) {
      const employee = dataEmployees.find((entry: Employee) => entry.id === Number(resourceId));
      if (!employee) return;

      setNameValue(employee.name);
      setLastnameValue(employee.lastname);
      setJobTitleValue(employee.job_title);
      setStatusValue(employee.status);
      return;
    }

    resetForm();
  }, [modalMode, resourceId, isOpen, dataEmployees]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const activeModal = modalMeta[modalMode];
  const isDeleting = modalMode === "deleteEmployee";

  return (
    <>
      <CrudModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onAction={handleModalAction}
        title={activeModal.title}
        description={activeModal.description}
        actionLabel={activeModal.actionLabel}
        tone={activeModal.tone}
        compact={activeModal.compact}
        isPending={isAddingEmployee || isEditingEmployee || isDeletingEmployee}
        isError={isAddingEmployeeError || isEditingEmployeeError || isDeletingEmployeeError}
        error={addingEmployeeError || editingEmployeeError || deletingEmployeeError}
        onReset={resetMutations}
      >
        {!isDeleting && (
          <div className="mt-8 space-y-4">
            <Input
              placeholder="Nombre"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
            <Input
              placeholder="Apellido"
              value={lastnameValue}
              onChange={(e) => setLastnameValue(e.target.value)}
            />
            <Input
              placeholder="Cargo"
              value={jobTitleValue}
              onChange={(e) => setJobTitleValue(e.target.value)}
            />
            <Select
              options={statusOptions}
              placeholder="Estado"
              value={statusValue}
              onChange={(value) => setStatusValue(value as Employee["status"])}
            />
          </div>
        )}
      </CrudModal>

      <StandardTable<EmployeeRow>
        selectRowId={selectedRowId}
        onRowSelect={onRowSelect}
        columns={columns}
        data={dataMapped}
        addBtn={() => openResourceModal("addEmployee")}
        editBtn={(id) => openResourceModal("editEmployee", id)}
        deleteBtn={(id) => openResourceModal("deleteEmployee", id)}
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
