import { LoginForm } from "../../../FormsArea/LoginForm/LoginForm";
import { RegisterForm } from "../../../FormsArea/RegisterForm/RegisterForm";
import { Modal } from "../../../ModalArea/Modal/Modal";
import { useLogin } from "./hooks/useLogin";

export function Login(): JSX.Element {
  const { closeModal, isModalOpen, openModal } = useLogin();

  return (
    <div className="flex flex-col h-full m-auto md768:3/12 lg:w-130 justify-center">
      <LoginForm openModal={openModal} />
      {isModalOpen && (
        <Modal
          overflow="overflow-hidden"
          component={<RegisterForm />}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
