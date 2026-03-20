import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import EquipmentTable from "../../components/tables/BasicTables/EquipmentsTable";
import Button from "@/components/ui/button/Button"; 
import { AddIcon } from "../../icons";
import { TrashBinIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import { useState } from "react";


export default function Equipments() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedOption, setSelectedOption] = useState("1");


  return (
    <>
      <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {"Agregar Equipo"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on
                track
              </p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <div className="flex gap-6 mb-5">
                    <Radio id="rad1" name="rad1" label="Equipo" value="1" checked={selectedOption === "1"} onChange={() => setSelectedOption("1")} />
                    <Radio id="rad2" name="rad1" label="Event Title" value="2" checked={selectedOption === "2"} onChange={() => setSelectedOption("2")} />
                  </div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title
                  </label>
                  <Input
                  className="mb-4"
                  placeholder="Enter event title"/>
                  <input
                    id="event-title"
                    type="text"
                    value={"titulo"}
                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Color
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">

                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date
                </label>
                <div className="relative">
                 
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <div className="relative">
                  
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                Add
              </button>
            </div>
          </div>
      </Modal>

      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      
      <PageBreadcrumb pageTitle="Equipments" />
      <div className="flex justify-end gap-3 text-xs pb-3" >
          <Button onClick={openModal} startIcon={<AddIcon />} variant="primary" size="sm"><span className="text-white">Add</span></Button>
          <Button startIcon={<TrashBinIcon />} variant="outline" size="sm"><span className="text-red-500">Delete</span></Button>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Lists of Equipments">

          <EquipmentTable />
        </ComponentCard>
      </div>
    </>
  );
}
