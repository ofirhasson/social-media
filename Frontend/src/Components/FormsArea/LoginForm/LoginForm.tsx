import { CredentialsModel } from "../../../Models/CredentialsModel";
import { GenericForm } from "../../GenericFormArea/GenericForm/GenericForm";
import { StringInput } from "../../GenericInputs/StringInput/StringInput";
import "./LoginForm.css";
import { useLoginForm } from "./hooks/useLoginForm";



export function LoginForm(): JSX.Element {
  const { handleSubmit, login, navigateToRegister, register } = useLoginForm();
  return (
    <>
      <GenericForm
        submit={handleSubmit(login)}
        buttonName="Login"
        header="Login"
        inputs={[
          <StringInput<CredentialsModel>
            name="new-email"
            label="Email"
            register={register}
            registerName="email"
            type="text"
          />,
          <StringInput<CredentialsModel>
            name="new-password"
            label="Password"
            register={register}
            registerName="password"
            type="password"
          />,

          <div className="flex justify-center mt-4 ">
            <button
              className="text-blue-500 rounded-xl p-1 w-36"
              type="button"
              onClick={navigateToRegister}
            >
              Register
              <hr className="text-black" />
            </button>
          </div>,
        ]}
      />
    </>
  );
}
