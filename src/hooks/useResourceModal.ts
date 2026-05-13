// hooks/useResourceModal.ts
import { useState } from "react";
import { useModal } from "@/hooks/useModal";

export function useResourceModal<TMode extends string>(initialMode: TMode) {
  const { isOpen, openModal, closeModal } = useModal();
  const [modalMode, setModalMode] = useState<TMode>(initialMode);
  const [resourceId, setResourceId] = useState<string | null>(null);

  const openResourceModal = (mode: TMode, id?: string | null) => {
    setModalMode(mode);
    setResourceId(id || null);
    openModal();
  };

  const closeResourceModal = () => {
    setResourceId(null);
    closeModal();
  };

  return {
    isOpen,
    modalMode,
    resourceId,
    openResourceModal,
    closeResourceModal,
  };
}
