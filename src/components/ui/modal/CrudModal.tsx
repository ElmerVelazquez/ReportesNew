import { ReactNode } from "react";
import { Modal } from ".";
import { FetchAlert } from "../alert/FetchAlert";

export type CrudModalTone = "add" | "edit" | "delete";

interface CrudModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onAction: () => void;
  actionLabel: string;
  tone: CrudModalTone;
  children?: ReactNode;
  isPending?: boolean;
  isError?: boolean;
  error?: unknown;
  onReset?: () => void;
  compact?: boolean;
}

const toneStyles: Record<CrudModalTone, string> = {
  add: "bg-brand-500 hover:bg-brand-600",
  edit: "bg-green-500 hover:bg-green-600",
  delete: "bg-red-500 hover:bg-red-600",
};

export function CrudModal({
  isOpen,
  title,
  description,
  onClose,
  onAction,
  actionLabel,
  tone,
  children,
  isPending = false,
  isError = false,
  error,
  onReset,
  compact = false,
}: CrudModalProps) {
  const modalClassName = `p-6 lg:p-10${compact ? " max-w-[400px]" : " max-w-[700px]"}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      isblurred={false}
      className={modalClassName}
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {title}
          </h5>
          <p className={`text-gray-500 dark:text-gray-400 ${compact ? "text-center text-md" : "text-sm"}`}>
            {description}
          </p>
        </div>

        {children && <div className="mt-8">{children}</div>}

        <div className={`flex items-center gap-3 mt-6 modal-footer ${compact ? "justify-center gap-10" : "sm:justify-end"}`}>
          <button
            onClick={onClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onAction}
            className={`flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto ${toneStyles[tone]}`}
          >
            {actionLabel}
          </button>
        </div>

        <FetchAlert
          isPending={isPending}
          isError={isError}
          error={error}
          onReset={onReset ?? (() => {})}
          variant="toast"
        />
      </div>
    </Modal>
  );
}
