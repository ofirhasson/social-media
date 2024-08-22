import { useEffect, useRef } from "react";

interface useModalProps {
  closeModal: () => void;
}

export const useModal = ({ closeModal }: useModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      // Check if the click target is part of the DatePicker
      const isDatePicker = (event.target as Element).closest(
        ".MuiPickersPopper-root"
      );
      if (!isDatePicker) {
        closeModal();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return {
    modalRef,
  };
};
