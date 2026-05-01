import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  isblurred?: boolean; // New prop to control background blur

}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  isblurred = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Efectos de Escape y Scroll (se mantienen igual)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white dark:bg-gray-900 shadow-xl";

  return (
    /* AnimatePresence permite que la animación de salida funcione antes de que el componente sea null */
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999 p-4">
          
          {/* 1. Backdrop (Fondo oscuro) con Fade In */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={"fixed inset-0 h-full w-full bg-gray-400/50" + (isblurred ? " dark:bg-gray-50/1 backdrop-blur-[32px]" : " dark:bg-black/50")}
              onClick={onClose}
            />
          )}

          {/* 2. Contenido del Modal bajando desde arriba */}
          <motion.div
            ref={modalRef}
            initial={{ y: -100, opacity: 0 }} // Empieza arriba y transparente
            animate={{ y: 0, opacity: 1 }}    // Baja a su sitio
            exit={{ y: -100, opacity: 0 }}    // Sube al cerrarse
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`${contentClasses} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseButton && (
              <button onClick={onClose} className="absolute right-3 top-3 z-999 ...">
                {/* ... (svg se mantiene igual) */}
              </button>
            )}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};