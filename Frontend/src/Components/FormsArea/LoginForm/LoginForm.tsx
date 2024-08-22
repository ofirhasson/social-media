import { CredentialsModel } from "../../../Models/CredentialsModel";
import { GenericForm } from "../../GenericFormArea/GenericForm/GenericForm";
import { StringInput } from "../../GenericInputs/StringInput/StringInput";
import "./LoginForm.css";
import { useLoginForm } from "./hooks/useLoginForm";

interface LoginFormProps {
    openModal: () => void
}

export function LoginForm({openModal}:LoginFormProps): JSX.Element {
  const { handleSubmit, login, navigateToRegister, register } = useLoginForm();
  return (
    <div className="w-full flex justify-center maxXs:flex-wrap items-center pr-3 ">
      <div className="h-auto flex ml-3 mb-3 items-start lg:w-full justify-start">
        <div className="text-left">
          <span className="text-blue-600 text-4xl text-left">Facebook</span>{" "}
          <br />{" "}
          <span className="text-white text-3xl">
            Connect with friends and the world <br /> around you on Facebook.
          </span>
        </div>
      </div>
      <GenericForm
        submit={handleSubmit(login)}
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

          <>
            <div className="mt-5 flex justify-center">
              <button
                className="text-white bg-blue-600 w-52  shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                type="submit"
              >
                Login
              </button>
            </div>

            <div className="flex justify-center mt-2  m-auto w-40 text-blue-400 ">
              <button className=" ">Forgot password</button>
            </div>
            <div className="flex w-auto justify-center">
              <hr className="absolute flex  text-gray-500 w-48  border-2 border-gray-600" />
            </div>
            <div className="flex justify-center w-full mt-3">
              <button
                className="text-white w-52 h-10 bg-green-400 rounded p-1"
                type="button"
                onClick={openModal}
              >
                Create New Account
              </button>
            </div>
          </>,
        ]}
      />
    </div>
  );
}
