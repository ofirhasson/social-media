import { memo } from "react";
import { ModalProps } from "../../../Models/Interfaces";
import "./Modal.css";
import { useModal } from "./hooks/useModal";

 function ModalComponent({
  component,
  closeModal,
  overflow,
}: ModalProps): JSX.Element {
  const { modalRef } = useModal({ closeModal });

  return (
    <div
      className="fixed left-0 top-0 z-[1055] flex h-full w-full items-center justify-center overflow-y-auto bg-gray-800 bg-opacity-50"
      aria-labelledby="modalTitle"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`relative  w-full max-w-4xl modal-custom-height ${overflow} bg-white rounded-lg shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 ">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{component}</div>
      </div>
    </div>
  );
}

export const Modal = memo(ModalComponent)
