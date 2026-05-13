import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StandardTable from "@/components/ui/table/StandardTable";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import Badge, { BadgeColor } from "@/components/ui/badge/Badge";
import { FetchAlert } from "@/components/ui/alert/FetchAlert";
import { CrudModal } from "@/components/ui/modal/CrudModal";
import { createRegister, deleteRegister, getRegisters, updateRegister } from "@/api/Register";
import { getRegisterTypes } from "@/api/RegisterType";
import { getCompanies } from "@/api/Company";
import { getEmployees } from "@/api/Employee";
import { getEquipment } from "@/api/Equipment";
import {
  Company,
  Employee,
  Equipo,
  Register,
  RegisterDto,
  RegisterType,
} from "@/types";
import { useResourceModal } from "@/hooks/useResourceModal";
import concentraLogo from "@/Assets/400x100_concentra.png";
import innovixLogo from "@/Assets/400x100_innovix.png";

type modalMode = "addRegister" | "editRegister" | "deleteRegister";

type RegisterRow = Register & {
  typeName: string;
  companyName: string;
  equipmentName: string;
  emisorName: string;
  receptorName: string;
};

const columns: ColumnDef<RegisterRow>[] = [
  {
    accessorKey: "companyName",
    header: "Empresa",
    cell: ({ getValue }) => {
      const value = getValue<string>();

      if (value === "Concentra") {
        return <img src={concentraLogo} alt="Concentra" className="h-8 w-auto max-w-[140px] object-contain" />;
      }

      if (value === "Innovix") {
        return <img src={innovixLogo} alt="Innovix" className="h-8 w-auto max-w-[140px] object-contain" />;
      }

      return <span>{value}</span>;
    },
  },
  {
    accessorKey: "typeName",
    header: "Tipo",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      const normalized = value.toLowerCase();
      const color: BadgeColor =
        normalized.includes("asig") ? "success" : normalized.includes("entreg") ? "warning" : "primary";

      return (
        <Badge size="sm" color={color}>
          {value}
        </Badge>
      );
    },
  },
  { accessorKey: "equipmentName", header: "Equipo" },
  { accessorKey: "emisorName", header: "Emisor (empleado)" },
  { accessorKey: "receptorName", header: "Receptor (empleado)" },
  {
    accessorKey: "comment",
    header: "Comentario",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return <span className="max-w-[220px] block truncate">{value || "-"}</span>;
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
  addRegister: {
    title: "Agregar Registro",
    description: "Introduce los datos del registro",
    actionLabel: "Add",
    compact: false,
    tone: "add",
  },
  editRegister: {
    title: "Editar Registro",
    description: "Edita los datos del registro",
    actionLabel: "Edit",
    compact: false,
    tone: "edit",
  },
  deleteRegister: {
    title: "Eliminar Registro",
    description: "¿Estás seguro de que deseas eliminar este registro?",
    actionLabel: "Delete",
    compact: true,
    tone: "delete",
  },
};

const formatEmployeeName = (employee?: Employee) =>
  employee
    ? `${employee.name} ${employee.lastname}`.trim() +
      (employee.job_title ? ` - ${employee.job_title}` : "")
    : "";

const formatEquipmentName = (equipment?: Equipo) => {
  if (!equipment) return "";

  const label = [equipment.type?.name, equipment.brand?.name, equipment.model?.name, equipment.serial]
    .filter(Boolean)
    .join(" · ");

  return label || `Equipo #${equipment.id}`;
};

export default function RegisterTable() {
  const queryClient = useQueryClient();
  const { isOpen, modalMode, resourceId, openResourceModal, closeResourceModal } =
    useResourceModal<modalMode>("addRegister");
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [typeValue, setTypeValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [equipmentValue, setEquipmentValue] = useState("");
  const [emisorValue, setEmisorValue] = useState("");
  const [receptorValue, setReceptorValue] = useState("");
  const [commentValue, setCommentValue] = useState("");

  const resetData = () => {
    queryClient.resetQueries({ queryKey: ["Registers"] });
    queryClient.resetQueries({ queryKey: ["RegisterTypes"] });
    queryClient.resetQueries({ queryKey: ["Companies"] });
    queryClient.resetQueries({ queryKey: ["Employees"] });
    queryClient.resetQueries({ queryKey: ["Equipments"] });
  };

  const resetMutations = () => {
    resetAddRegister();
    resetEditRegister();
    resetDeleteRegister();
  };

  const resetForm = () => {
    setTypeValue("");
    setCompanyValue("");
    setEquipmentValue("");
    setEmisorValue("");
    setReceptorValue("");
    setCommentValue("");
  };

  const handleModalClose = () => {
    setSelectedRowId(null);
    closeResourceModal();
    resetForm();
    resetMutations();
  };

  const handleModalAction = () => {
    const payload: RegisterDto = {
      type_register_id: Number(typeValue),
      company_id: Number(companyValue),
      equipment_id: Number(equipmentValue),
      emisor_id: Number(emisorValue),
      receptor_id: Number(receptorValue),
      comment: commentValue,
    };

    if (modalMode === "addRegister") {
      addRegister(payload);
      return;
    }

    if (modalMode === "editRegister" && resourceId) {
      editRegister({ id: Number(resourceId), ...payload });
      return;
    }

    if (modalMode === "deleteRegister" && resourceId) {
      deleteRegisterData(resourceId);
    }
  };

  const {
    mutate: addRegister,
    isPending: isAddingRegister,
    isError: isAddingRegisterError,
    error: addingRegisterError,
    reset: resetAddRegister,
  } = useMutation({
    mutationFn: createRegister,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Registers"] });
      handleModalClose();
    },
  });

  const {
    mutate: editRegister,
    isPending: isEditingRegister,
    isError: isEditingRegisterError,
    error: editingRegisterError,
    reset: resetEditRegister,
  } = useMutation({
    mutationFn: updateRegister,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Registers"] });
      handleModalClose();
    },
  });

  const {
    mutate: deleteRegisterData,
    isPending: isDeletingRegister,
    isError: isDeletingRegisterError,
    error: deletingRegisterError,
    reset: resetDeleteRegister,
  } = useMutation({
    mutationFn: deleteRegister,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Registers"] });
      handleModalClose();
    },
  });

  const {
    data: dataRegisters = [],
    isLoading: isLoadingRegisters,
    isError: isErrorRegisters,
    error: errorRegisters,
  } = useQuery({
    queryKey: ["Registers"],
    queryFn: getRegisters,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const {
    data: dataRegisterTypes = [],
    isLoading: isLoadingRegisterTypes,
    isError: isErrorRegisterTypes,
    error: errorRegisterTypes,
  } = useQuery({
    queryKey: ["RegisterTypes"],
    queryFn: getRegisterTypes,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const {
    data: dataCompanies = [],
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
    error: errorCompanies,
  } = useQuery({
    queryKey: ["Companies"],
    queryFn: getCompanies,
    select: (res) => res.data,
    staleTime: 1000 * 60,
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

  const {
    data: dataEquipment = [],
    isLoading: isLoadingEquipment,
    isError: isErrorEquipment,
    error: errorEquipment,
  } = useQuery({
    queryKey: ["Equipments"],
    queryFn: getEquipment,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const registerTypeOptions = dataRegisterTypes.map((registerType: RegisterType) => ({
    value: registerType.id.toString(),
    label: registerType.name,
  }));

  const companyOptions = dataCompanies.map((company: Company) => ({
    value: company.id.toString(),
    label: company.name,
  }));

  const employeeOptions = dataEmployees.map((employee: Employee) => ({
    value: employee.id.toString(),
    label: formatEmployeeName(employee),
  }));

  const equipmentOptions = dataEquipment.map((equipment: Equipo) => ({
    value: equipment.id.toString(),
    label: formatEquipmentName(equipment),
  }));

const equipmentLookup = new Map(dataEquipment.map((equipment: Equipo) => [equipment.id, formatEquipmentName(equipment)]));
  const companyLookup = new Map(dataCompanies.map((company: Company) => [company.id, company.name]));
  const employeeLookup = new Map(dataEmployees.map((employee: Employee) => [employee.id, formatEmployeeName(employee)]));
  const registerTypeLookup = new Map(dataRegisterTypes.map((registerType: RegisterType) => [registerType.id, registerType.name]));

  const dataMapped: RegisterRow[] = dataRegisters.map((register: Register) => ({
    ...register,
    typeName: register.type?.name ?? registerTypeLookup.get(register.type_register_id) ?? `Tipo #${register.type_register_id}`,
    companyName: register.company?.name ?? companyLookup.get(register.company_id) ?? `Empresa #${register.company_id}`,
    equipmentName:
      register.equipment?.id
        ? formatEquipmentName(register.equipment)
        : equipmentLookup.get(register.equipment_id) ?? `Equipo #${register.equipment_id}`,
    emisorName:
      register.emisor?.id
        ? formatEmployeeName(register.emisor)
        : employeeLookup.get(register.emisor_id) ?? `Empleado #${register.emisor_id}`,
    receptorName:
      register.receptor?.id
        ? formatEmployeeName(register.receptor)
        : employeeLookup.get(register.receptor_id) ?? `Empleado #${register.receptor_id}`,
  }));

  useEffect(() => {
    if (!isOpen) return;

    if (modalMode === "editRegister" && resourceId) {
      const register = dataRegisters.find((entry: Register) => entry.id === Number(resourceId));
      if (!register) return;

      setTypeValue(String(register.type_register_id));
      setCompanyValue(String(register.company_id));
      setEquipmentValue(String(register.equipment_id));
      setEmisorValue(String(register.emisor_id));
      setReceptorValue(String(register.receptor_id));
      setCommentValue(register.comment ?? "");
      return;
    }

    resetForm();
  }, [modalMode, resourceId, isOpen, dataRegisters]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const activeModal = modalMeta[modalMode];
  const isDeleting = modalMode === "deleteRegister";

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
        isPending={isAddingRegister || isEditingRegister || isDeletingRegister}
        isError={isAddingRegisterError || isEditingRegisterError || isDeletingRegisterError}
        error={addingRegisterError || editingRegisterError || deletingRegisterError}
        onReset={resetMutations}
      >
        {!isDeleting && (
          <div className="space-y-4">
            <Select
              options={registerTypeOptions}
              placeholder="Tipo de registro"
              value={typeValue}
              onChange={setTypeValue}
            />
            <Select
              options={companyOptions}
              placeholder="Empresa"
              value={companyValue}
              onChange={setCompanyValue}
            />
            <Select
              options={equipmentOptions}
              placeholder="Equipo"
              value={equipmentValue}
              onChange={setEquipmentValue}
            />
            <Select
              options={employeeOptions}
              placeholder="Empleado emisor"
              value={emisorValue}
              onChange={setEmisorValue}
            />
            <Select
              options={employeeOptions}
              placeholder="Empleado receptor"
              value={receptorValue}
              onChange={setReceptorValue}
            />
            <TextArea
              placeholder="Comentario"
              rows={4}
              value={commentValue}
              onChange={setCommentValue}
              className="mb-4"
            />
          </div>
        )}
      </CrudModal>

      <StandardTable<RegisterRow>
        selectRowId={selectedRowId}
        onRowSelect={setSelectedRowId}
        columns={columns}
        data={dataMapped}
        addBtn={() => openResourceModal("addRegister")}
        editBtn={(id) => openResourceModal("editRegister", id)}
        deleteBtn={(id) => openResourceModal("deleteRegister", id)}
      />

      <FetchAlert
        isPending={
          isLoadingRegisters ||
          isLoadingRegisterTypes ||
          isLoadingCompanies ||
          isLoadingEmployees ||
          isLoadingEquipment
        }
        isError={
          isErrorRegisters ||
          isErrorRegisterTypes ||
          isErrorCompanies ||
          isErrorEmployees ||
          isErrorEquipment
        }
        error={
          errorRegisters ||
          errorRegisterTypes ||
          errorCompanies ||
          errorEmployees ||
          errorEquipment
        }
        onReset={resetData}
        variant="toast"
      />
    </>
  );
}
