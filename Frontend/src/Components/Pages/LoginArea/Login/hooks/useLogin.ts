import { useState } from "react";

export const useLogin = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  return {
    isModalOpen,
    closeModal,
    openModal
  }

}