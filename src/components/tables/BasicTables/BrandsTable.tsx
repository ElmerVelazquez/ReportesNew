import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StandardTable from "@/components/ui/table/StandardTable";
import Input from "@/components/form/input/InputField";
import { marca, modelo } from "@/types";
import {
  createEquipmentBrand,
  deleteEquipmentBrand,
  getEquipmentBrand,
  updateEquipmentBrand,
} from "@/api/EquipmentBrand";
import {
  createEquipmentModel,
  deleteEquipmentModel,
  getEquipmentTModel,
  updateEquipmentModel,
} from "@/api/EquipmentModel";
import { FetchAlert } from "@/components/ui/alert/FetchAlert";
import { CrudModal } from "@/components/ui/modal/CrudModal";
import { useResourceModal } from "@/hooks/useResourceModal";

type modalMode =
  | "addBrand"
  | "addModel"
  | "editBrand"
  | "editModel"
  | "deleteBrand"
  | "deleteModel";

const columnsMarcas: ColumnDef<marca>[] = [{ accessorKey: "name", header: "Marcas" }];
const columnsModelos: ColumnDef<modelo>[] = [{ accessorKey: "name", header: "modelos" }];

const modalMeta: Record<
  modalMode,
  {
    title: string;
    description: string;
    actionLabel: string;
    compact: boolean;
    tone: "add" | "edit" | "delete";
    placeholder?: string;
  }
> = {
  addBrand: {
    title: "Agregar Marca",
    description: "Introduce los datos de la marca",
    actionLabel: "Add",
    compact: false,
    tone: "add",
    placeholder: "Nombre de la marca",
  },
  addModel: {
    title: "Agregar Modelo",
    description: "Introduce los datos del modelo",
    actionLabel: "Add",
    compact: false,
    tone: "add",
    placeholder: "Nombre del modelo",
  },
  editBrand: {
    title: "Editar Marca",
    description: "Edita los datos de la marca",
    actionLabel: "Edit",
    compact: false,
    tone: "edit",
    placeholder: "Nombre de la marca",
  },
  editModel: {
    title: "Editar Modelo",
    description: "Edita los datos del modelo",
    actionLabel: "Edit",
    compact: false,
    tone: "edit",
    placeholder: "Nombre del modelo",
  },
  deleteBrand: {
    title: "Eliminar Marca",
    description: "¿Estás seguro de que deseas eliminar esta marca?",
    actionLabel: "Delete",
    compact: true,
    tone: "delete",
  },
  deleteModel: {
    title: "Eliminar Modelo",
    description: "¿Estás seguro de que deseas eliminar este modelo?",
    actionLabel: "Delete",
    compact: true,
    tone: "delete",
  },
};

interface BrandsTableProps {
  selectedModelId: string | null;
  onRowSelectedModelId: (id: string | null) => void;
  selectedBrandId: string | null;
  onRowSelectedBrandId: (id: string | null) => void;
}

export default function BrandsTable({
  selectedModelId,
  onRowSelectedModelId,
  selectedBrandId,
  onRowSelectedBrandId,
}: BrandsTableProps) {
  const queryClient = useQueryClient();
  const { isOpen, modalMode, resourceId, openResourceModal, closeResourceModal } =
    useResourceModal<modalMode>("addBrand");
  const [inputValue, setInputValue] = useState("");

  const resetData = () => {
    queryClient.resetQueries({ queryKey: ["EquipmentModels"] });
    queryClient.resetQueries({ queryKey: ["EquipmentBrands"] });
  };

  const resetMutations = () => {
    resetAddBrand();
    resetAddModel();
    resetEditBrand();
    resetEditModel();
    resetDeleteBrand();
    resetDeleteModel();
  };

  const handleModalClose = () => {
    setInputValue("");
    closeResourceModal();
    resetMutations();
  };

  const handleModalAction = () => {
    if (modalMode === "addBrand") {
      addBrand({ name: inputValue });
      return;
    }

    if (modalMode === "addModel") {
      if (!selectedBrandId) return;
      addModel({ name: inputValue, equipment_brand_id: Number(selectedBrandId) });
      return;
    }

    if (modalMode === "editBrand" && resourceId) {
      editBrand({ id: Number(resourceId), name: inputValue });
      return;
    }

    if (modalMode === "editModel" && resourceId) {
      editModel({ id: Number(resourceId), name: inputValue });
      return;
    }

    if (modalMode === "deleteBrand" && resourceId) {
      deleteBrand(Number(resourceId));
      return;
    }

    if (modalMode === "deleteModel" && resourceId) {
      deleteModel(Number(resourceId));
    }
  };

  const { mutate: addBrand, isPending: isAddingBrand, isError: isAddingBrandError, error: addingBrandError, reset: resetAddBrand } = useMutation({
    mutationFn: createEquipmentBrand,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
      handleModalClose();
    },
  });
  const { mutate: addModel, isPending: isAddingModel, isError: isAddingModelError, error: addingModelError, reset: resetAddModel } = useMutation({
    mutationFn: createEquipmentModel,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      handleModalClose();
    },
  });
  const { mutate: editBrand, isPending: isEditingBrand, isError: isEditingBrandError, error: editingBrandError, reset: resetEditBrand } = useMutation({
    mutationFn: updateEquipmentBrand,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
      handleModalClose();
    },
  });
  const { mutate: editModel, isPending: isEditingModel, isError: isEditingModelError, error: editingModelError, reset: resetEditModel } = useMutation({
    mutationFn: updateEquipmentModel,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      handleModalClose();
    },
  });
  const { mutate: deleteBrand, isPending: isDeletingBrand, isError: isDeletingBrandError, error: deletingBrandError, reset: resetDeleteBrand } = useMutation({
    mutationFn: deleteEquipmentBrand,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentBrands"] });
      handleModalClose();
    },
  });
  const { mutate: deleteModel, isPending: isDeletingModel, isError: isDeletingModelError, error: deletingModelError, reset: resetDeleteModel } = useMutation({
    mutationFn: deleteEquipmentModel,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["EquipmentModels"] });
      handleModalClose();
    },
  });

  const {
    data: dataMarca = [],
    isLoading: loadingMarcas,
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
    isLoading: loadingModelos,
    isError: isErrorModelos,
    error: errorModelos,
  } = useQuery({
    queryKey: ["EquipmentModels"],
    queryFn: getEquipmentTModel,
    select: (res) => res.data,
    staleTime: 1000 * 60,
  });

  const modelosFiltrados = selectedBrandId
    ? dataModelos.filter((m: modelo) => String(m.brand.id) === selectedBrandId)
    : dataModelos;

  useEffect(() => {
    if (!isOpen) return;

    if (modalMode === "editBrand" && resourceId) {
      const dat = dataMarca.find((e: marca) => e.id === Number(resourceId));
      setInputValue(dat?.name ?? "");
      return;
    }

    if (modalMode === "editModel" && resourceId) {
      const dat = dataModelos.find((e: modelo) => e.id === Number(resourceId));
      setInputValue(dat?.name ?? "");
      return;
    }

    setInputValue("");
  }, [modalMode, resourceId, isOpen, dataMarca, dataModelos]);

  const activeModal = modalMeta[modalMode];
  const isDeleting = modalMode === "deleteBrand" || modalMode === "deleteModel";

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
        isPending={
          isAddingBrand ||
          isAddingModel ||
          isEditingBrand ||
          isEditingModel ||
          isDeletingBrand ||
          isDeletingModel
        }
        isError={
          isAddingBrandError ||
          isAddingModelError ||
          isEditingBrandError ||
          isEditingModelError ||
          isDeletingBrandError ||
          isDeletingModelError
        }
        error={
          addingBrandError?.message ||
          addingModelError?.message ||
          editingBrandError?.message ||
          editingModelError?.message ||
          deletingBrandError?.message ||
          deletingModelError?.message
        }
        onReset={resetMutations}
      >
        {!isDeleting && (
          <div className="mt-8">
            <Input
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              className="mb-4"
              placeholder={activeModal.placeholder ?? "Nombre"}
            />
          </div>
        )}
      </CrudModal>

      <div className="flex gap-10 justify-center">
        <div className="w-full">
          <StandardTable<marca>
            addBtn={() => openResourceModal("addBrand")}
            isAddable={true}
            editBtn={(id) => openResourceModal("editBrand", id)}
            deleteBtn={(id) => openResourceModal("deleteBrand", id)}
            selectRowId={selectedBrandId}
            onRowSelect={onRowSelectedBrandId}
            columns={columnsMarcas}
            data={dataMarca}
          />
        </div>
        <div className="w-full">
          <StandardTable<modelo>
            addBtn={() => openResourceModal("addModel")}
            isAddable={!!selectedBrandId}
            editBtn={(id) => openResourceModal("editModel", id)}
            deleteBtn={(id) => openResourceModal("deleteModel", id)}
            selectRowId={selectedModelId}
            onRowSelect={onRowSelectedModelId}
            columns={columnsModelos}
            data={modelosFiltrados}
          />
        </div>
      </div>

      <FetchAlert
        isPending={loadingMarcas || loadingModelos}
        isError={isErrorMarcas || isErrorModelos}
        error={errorMarcas || errorModelos}
        onReset={resetData}
        variant="toast"
      />
    </>
  );
}
