import { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  component?: ReactNode;
  closeModal: () => void;

}

export function Modal({
  component,
  closeModal,

}: ModalProps): JSX.Element {
  return (
    <>
  
        <div
          className="fixed left-0 top-0 z-[1055] flex h-full w-full items-center justify-center overflow-y-auto bg-gray-800 bg-opacity-50"
          aria-labelledby="modalTitle"
          aria-modal="true"
        >
          <div className="relative w-full mt-10 max-w-4xl modal-custom-height overflow-auto bg-white rounded-lg shadow-lg">
            <div className="flex items-center  justify-between p-4 border-b">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800"
                onClick={closeModal} // Correctly use closeModal
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
            <div className="p-4">{component}</div>
            <div className="flex justify-end p-4 border-t">
              <button
                type="button"
                className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded"
                onClick={closeModal} // Correctly use closeModal
              >
                Close
              </button>
            </div>
          </div>
        </div>
 
    </>
  );
}
