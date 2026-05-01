import { Modal } from ".";
import { FetchAlert } from "../alert/FetchAlert";

interface ModalFormProps {
    isOpen: boolean;
    closeModal: () => void;
    handleModalClose: () => void;
    modalMode: "addEquipment" | "editEquipment" | "deleteEquipment";
    children: React.ReactNode;
    handleModalAction: () => void;
    isPending: boolean;
    isError: boolean;
    error?: any;
    resetMutations: () => void;
}

export default function ModalForm({ 
    isOpen, 
    handleModalClose, 
    modalMode, 
    children, 
    handleModalAction, 
    isPending, 
    isError, 
    error,
    resetMutations }: ModalFormProps) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            showCloseButton={false}
            isblurred={false}
            className={"p-6 lg:p-10" + ( (modalMode === "deleteEquipment") ? " max-w-[400px]" : " max-w-[700px]")}
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                    {
                    modalMode === "addEquipment" ? "Agregar Equipo" :
                    modalMode === "editEquipment" ? "Editar Equipo" :
                    ""
                    }
                </h5>
                <p className={" text-gray-500 dark:text-gray-400" + ((modalMode === "deleteEquipment") ? " text-center text-md" : " text-sm")}>
                    {
                    modalMode === "addEquipment" ? "Introduce los datos del equipo" :
                    modalMode === "editEquipment" ? "Edita los datos del equipo" :
                    modalMode === "deleteEquipment" ? "¿Estás seguro de que deseas eliminar este equipo?" :
                    ""                
                    }
                </p>
            </div>
            <div className="mt-8">
                <div>
                {(modalMode === "addEquipment" || modalMode === "editEquipment") && (
                <div>
                    {children}
                    
                </div>
                )}
                </div>
            </div>
            <div className={"flex items-center gap-3 mt-6 modal-footer "+( (modalMode === "deleteEquipment") ? "justify-center gap-10" : "sm:justify-end")}>
                <button
                    onClick={handleModalClose}
                    type="button"
                    className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                    >
                    Close
                </button>
                <button
                    type="button"
                    onClick={handleModalAction}
                    className={`flex w-full justify-center rounded-lg  px-4 py-2.5 text-sm font-medium text-white  sm:w-auto 
                        ${modalMode === "addEquipment"? "bg-brand-500 hover:bg-brand-600" : 
                            modalMode === "editEquipment"? "bg-green-500 hover:bg-green-600":
                            modalMode === "deleteEquipment"? "bg-red-500 hover:bg-red-600":""}`}
                    >
                    {(modalMode === "addEquipment")? "Add" :
                        (modalMode === "editEquipment")? "Edit" :
                        (modalMode === "deleteEquipment")? "Delete" :
                        ""}
                </button>
            </div>
            
                <FetchAlert 
                    isPending={isPending} 
                    isError={isError} 
                    error={error} 
                    onReset={resetMutations}
                    variant="toast" 
                />
            </div>
        </Modal>
    )}

    