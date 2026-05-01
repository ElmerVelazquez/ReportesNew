import Alert from "@/components/ui/alert/Alert";
import { motion, AnimatePresence } from "framer-motion";

interface ActionStatusProps {
  isPending: boolean;
  isError: boolean;
  error?: any;
  onReset: () => void;
  variant?: "inline" | "toast"; // Nueva prop para flexibilidad
}

export const FetchAlert = ({ isPending, isError, error, onReset, variant = "inline" }: ActionStatusProps) => {
  
  // Clases según dónde queramos mostrarlo
  const containerClasses = variant === "toast" 
    ? "fixed bottom-5 right-5 z-[9999] max-w-sm" 
    : "w-full my-4"; // "inline" fluye con el contenido (ej. antes de los botones)

  return (
    <AnimatePresence>
      {isPending && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="flex justify-center p-4"
        >
          <motion.div
            className="w-13 h-13 border-4 rounded-full border-gray-200 border-t-blue-600"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </motion.div>
      )}

      {isError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={containerClasses}
        >
          <Alert
            title="Error de operación"
            message={error?.message || "Ha ocurrido un error inesperado."}
            variant="error"
            onClick={onReset}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};