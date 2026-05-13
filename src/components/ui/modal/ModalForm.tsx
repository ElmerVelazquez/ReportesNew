import { CrudModal, CrudModalTone } from "./CrudModal";

interface ModalFormProps {
  isOpen: boolean;
  closeModal: () => void;
  handleModalClose: () => void;
  modalMode: "addEquipment" | "editEquipment" | "deleteEquipment";
  children: React.ReactNode;
  handleModalAction: () => void;
  isPending: boolean;
  isError: boolean;
  error?: unknown;
  resetMutations: () => void;
}

const modalMeta: Record<
  ModalFormProps["modalMode"],
  {
    title: string;
    description: string;
    actionLabel: string;
    tone: CrudModalTone;
    compact: boolean;
  }
> = {
  addEquipment: {
    title: "Agregar Equipo",
    description: "Introduce los datos del equipo",
    actionLabel: "Add",
    tone: "add",
    compact: false,
  },
  editEquipment: {
    title: "Editar Equipo",
    description: "Edita los datos del equipo",
    actionLabel: "Edit",
    tone: "edit",
    compact: false,
  },
  deleteEquipment: {
    title: "Eliminar Equipo",
    description: "¿Estás seguro de que deseas eliminar este equipo?",
    actionLabel: "Delete",
    tone: "delete",
    compact: true,
  },
};

export default function ModalForm({
  isOpen,
  handleModalClose,
  modalMode,
  children,
  handleModalAction,
  isPending,
  isError,
  error,
  resetMutations,
}: ModalFormProps) {
  const meta = modalMeta[modalMode];

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={handleModalClose}
      onAction={handleModalAction}
      title={meta.title}
      description={meta.description}
      actionLabel={meta.actionLabel}
      tone={meta.tone}
      compact={meta.compact}
      isPending={isPending}
      isError={isError}
      error={error}
      onReset={resetMutations}
    >
      {modalMode !== "deleteEquipment" ? children : null}
    </CrudModal>
  );
}
