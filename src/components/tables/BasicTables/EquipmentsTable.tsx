import { BadgeColor } from "../../ui/badge/Badge";
import Badge from "../../ui/badge/Badge";
import StandardTable from "@/components/ui/table/StandardTable";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchAlert } from "@/components/ui/alert/FetchAlert";
import { CrudModal } from "@/components/ui/modal/CrudModal";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { createEquipment, deleteEquipment, getEquipment, updateEquipment } from "@/api/Equipment";
import { getEquipmentTypes } from "@/api/EquipmentType";
import { getEquipmentBrand } from "@/api/EquipmentBrand";
import { getEquipmentTModel } from "@/api/EquipmentModel";
import { getEquipmentStatus } from "@/api/EquipmentStatus";
import { marca, modelo, StatusEquipo, Equipo } from "@/types";
import { useResourceModal } from "@/hooks/useResourceModal";

const columns: ColumnDef<Equipo>[] = [
  { accessorKey: "equipment", header: "Equipo" },
  { accessorKey: "brand", header: "Marca" },
  { accessorKey: "model", header: "Modelo" },
  { accessorKey: "serial", header: "Serial" },
  {
    accessorKey: "status",
    header: "Estatus",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const color: BadgeColor =
        status === "En servicio" ? "primary" : status === "Fuera de servicio" ? "error" : "light";

      return <Badge size="sm" color={color}>{status}</Badge>;
    },
  },
  {
    accessorKey: "note",
    header: "Nota",
    cell: ({ getValue }) => {
      const note = getValue<string>();
      return <span className="max-w-[200px] block truncate">{note}</span>;
    },
  },
];

interface EquipmentTableProps {
  selectedRowId: string | null;
  onRowSelect: (id: string | null) => void;
}

type modalMode = "addEquipment" | "editEquipment" | "deleteEquipment";

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
  addEquipment: {
    title: "Agregar Equipo",
    description: "Introduce los datos del equipo",
    actionLabel: "Add",
    compact: false,
    tone: "add",
  },
  editEquipment: {
    title: "Editar Equipo",
    description: "Edita los datos del equipo",
    actionLabel: "Edit",
    compact: false,
    tone: "edit",
  },
  deleteEquipment: {
    title: "Eliminar Equipo",
    description: "¿Estás seguro de que deseas eliminar este equipo?",
    actionLabel: "Delete",
    compact: true,
    tone: "delete",
  },
};

export default function EquipmentTable({ selectedRowId, onRowSelect }: EquipmentTableProps) {
  const queryClient = useQueryClient();
  const { isOpen, modalMode, resourceId, openResourceModal, closeResourceModal } =
    useResourceModal<modalMode>("addEquipment");
  const [statusValue, setStatusValue] = useState("1");
  const [typeValue, setTypeValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [serialValue, setSerialValue] = useState("");
  const [commentValue, setCommentValue] = useState("");

  const resetData = () => {
    queryClient.resetQueries({ queryKey: ["EquipmentModels"] });
    queryClient.resetQueries({ queryKey: ["EquipmentBrands"] });
    queryClient.resetQueries({ queryKey: ["EquipmentTypes"] });
    queryClient.resetQueries({ queryKey: ["EquipmentStatus"] });
    queryClient.resetQueries({ queryKey: ["Equipments"] });
  };

  const resetMutations = () => {
    resetAddEquipment();
    resetUpdateEquipment();
    resetDeleteEquipment();
  };

  const resetForm = () => {
    setStatusValue("1");
    setTypeValue("");
    setBrandValue("");
    setModelValue("");
    setSerialValue("");
    setCommentValue("");
  };

  const handleModalClose = () => {
    closeResourceModal();
    resetForm();
    resetMutations();
  };

  const handleModalAction = () => {
    if (modalMode === "addEquipment") {
      addEquipment({
        equipment_type_id: Number(typeValue),
        equipment_brand_id: Number(brandValue),
        equipment_model_id: Number(modelValue),
        equipment_status_id: Number(statusValue),
        serial: serialValue,
        comment: commentValue,
      });
      return;
    }

    if (modalMode === "editEquipment" && resourceId) {
      editEquipment({
        id: Number(resourceId),
        equipment_type_id: Number(typeValue),
        equipment_brand_id: Number(brandValue),
        equipment_model_id: Number(modelValue),
        equipment_status_id: Number(statusValue),
        serial: serialValue,
        comment: commentValue,
      });
      return;
    }

    if (modalMode === "deleteEquipment" && resourceId) {
      deleteEquipmentData(resourceId);
    }
  };

  const { mutate: addEquipment, isPending: isAddingEquipment, isError: isAddingEquipmentError, error: addingEquipmentError, reset: resetAddEquipment } = useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
      handleModalClose();
    },
  });
  const { mutate: editEquipment, isPending: isEditingEquipment, isError: isEditingEquipmentError, error: editingEquipmentError, reset: resetUpdateEquipment } = useMutation({
    mutationFn: updateEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
      handleModalClose();
    },
  });
  const { mutate: deleteEquipmentData, isPending: isDeletingEquipment, isError: isDeletingEquipmentError, error: deletingEquipmentError, reset: resetDeleteEquipment } = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["Equipments"] });
      handleModalClose();
    },
  });

  const {
    data: dataEquipments = [],
    isLoading: isLoadingEquipments,
    isError: isErrorEquipments,
    error: errorEquipments,
  } = useQuery({
    queryKey: ["Equipments"],
    queryFn: getEquipment,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });
  const {
    data: dataEquipmentStatus = [],
    isLoading: isLoadingEquipmentStatus,
    isError: isErrorEquipmentStatus,
    error: errorEquipmentStatus,
  } = useQuery({
    queryKey: ["EquipmentStatus"],
    queryFn: getEquipmentStatus,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });
  const { data: dataEquipmentTypes = [] } = useQuery({
    queryKey: ["EquipmentTypes"],
    queryFn: getEquipmentTypes,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });
  const {
    data: dataMarca = [],
    isLoading: isLoadingMarcas,
    isError: isErrorMarcas,
    error: errorMarcas,
  } = useQuery({
    queryKey: ["EquipmentBrands"],
    queryFn: getEquipmentBrand,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });
  const {
    data: dataModelos = [],
    isLoading: isLoadingModelos,
    isError: isErrorModelos,
    error: errorModelos,
  } = useQuery({
    queryKey: ["EquipmentModels"],
    queryFn: getEquipmentTModel,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const dataMapped = dataEquipments.map((equipment: Equipo) => ({
    id: equipment.id,
    equipment: equipment.type.name,
    brand: equipment.brand.name,
    model: equipment.model.name,
    serial: equipment.serial,
    status: equipment.status.name,
    note: equipment.comment,
  }));

  const equipmentTypesOptions = dataEquipmentTypes.map((type: { id: number; name: string }) => ({
    value: type.id.toString(),
    label: type.name,
  }));
  const marcaOptions = dataMarca.map((marca: marca) => ({
    value: marca.id.toString(),
    label: marca.name,
  }));
  const modeloFiltered = dataModelos.filter((modelo: modelo) => String(modelo.brand.id) === brandValue);
  const modeloOptions = modeloFiltered.map((modelo: modelo) => ({
    value: modelo.id.toString(),
    label: modelo.name,
  }));

  useEffect(() => {
    if (!isOpen || modalMode !== "editEquipment" || !resourceId) return;

    const dat = dataEquipments.find((e: Equipo) => e.id === Number(resourceId));
    if (!dat) return;

    setStatusValue(String(dat.status.id));
    setTypeValue(String(dat.type.id));
    setBrandValue(String(dat.brand.id));
    setModelValue(String(dat.model.id));
    setSerialValue(dat.serial);
    setCommentValue(dat.comment);
  }, [modalMode, resourceId, isOpen, dataEquipments]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const activeModal = modalMeta[modalMode];
  const isEditable = modalMode !== "deleteEquipment";

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
        isPending={isAddingEquipment || isEditingEquipment || isDeletingEquipment}
        isError={isAddingEquipmentError || isEditingEquipmentError || isDeletingEquipmentError}
        error={addingEquipmentError || editingEquipmentError || deletingEquipmentError}
        onReset={resetMutations}
      >
        {isEditable && (                                                                                                                                                                                                                                           
          <div className="mt-8">
            <div className="flex gap-6 mb-5">
              {dataEquipmentStatus.map((status: StatusEquipo) => (
                <Radio
                  key={status.id}
                  id={`rad${status.id}`}
                  name="rad1"
                  label={status.name}
                  value={status.id.toString()}
                  checked={statusValue === String(status.id)}
                  onChange={() => setStatusValue(String(status.id))}
                />
              ))}
            </div>
            <Select options={equipmentTypesOptions} placeholder="Tipo de equipo" value={typeValue} onChange={(value) => setTypeValue(value)} className="dark:bg-dark-900 mb-4" />
            <Select options={marcaOptions} placeholder="Marca" value={brandValue} onChange={(value) => setBrandValue(value)} className="dark:bg-dark-900 mb-4" />
            <Select options={modeloOptions} placeholder="Modelo" value={modelValue} onChange={(value) => setModelValue(value)} className="dark:bg-dark-900 mb-4" />
            <Input className="mb-4" placeholder="Serial" value={serialValue} onChange={(e) => setSerialValue(e.target.value)} />
            <TextArea placeholder="Nota" rows={4} className="mb-4" value={commentValue} onChange={(value) => setCommentValue(value)} />
          </div>
        )}
      </CrudModal>

      <StandardTable<Equipo>
        selectRowId={selectedRowId}
        onRowSelect={onRowSelect}
        columns={columns}
        data={dataMapped}
        addBtn={() => openResourceModal("addEquipment")}
        editBtn={(id) => openResourceModal("editEquipment", id)}
        deleteBtn={(id) => openResourceModal("deleteEquipment", id)}
      />

      <FetchAlert
        isPending={isLoadingEquipments || isLoadingMarcas || isLoadingModelos || isLoadingEquipmentStatus}
        isError={isErrorEquipments || isErrorMarcas || isErrorModelos || isErrorEquipmentStatus}
        error={errorEquipments || errorMarcas || errorModelos || errorEquipmentStatus}
        onReset={resetData}
        variant="toast"
      />
    </>
  );
}
