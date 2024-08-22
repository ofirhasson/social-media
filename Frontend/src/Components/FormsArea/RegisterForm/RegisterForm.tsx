import { FormProvider } from "react-hook-form";
import { UserModel } from "../../../Models/UserModel";
import { GenericForm } from "../../GenericFormArea/GenericForm/GenericForm";
import { DatePickerInput } from "../../GenericInputs/DatePickerInput/DatePickerInput";
import { RadioInput } from "../../GenericInputs/RadioInput/RadioInput";
import { StringInput } from "../../GenericInputs/StringInput/StringInput";
import { useRegisterForm } from "./hooks/useRegisterForm";
import "./RegisterForm.css";

export function RegisterForm(): JSX.Element {
  const {
    handleSubmit,
    navigateToLogin,
    register,
    registerUser,
    setValue,
    methods,
  } = useRegisterForm();

  return (
    <div className="RegisterForm">
      <FormProvider {...methods}>
        <GenericForm
          submit={handleSubmit(registerUser)}
          inputs={[
            <StringInput<UserModel>
              label="First name"
              name="newFirstName"
              type="text"
              register={register}
              registerName={"userDetails.firstName"}
            />,
            <StringInput<UserModel>
              label="Last name"
              name="newLastName"
              type="text"
              register={register}
              registerName={"userDetails.lastName"}
            />,
            <StringInput<UserModel>
              label="Email"
              name="newEmail"
              type="email"
              register={register}
              registerName={"userDetails.email"}
            />,

            <StringInput<UserModel>
              label="Password"
              name="newPassword"
              type="password"
              register={register}
              registerName={"userDetails.password"}
            />,

            <DatePickerInput<UserModel>
              name={"userDetails.birthday"}
              registerOptions={{ required: true }}
              setValue={setValue}
            />,

            <RadioInput<UserModel>
              name={"userDetails.gender"}
              label="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              setValue={setValue}
            />,
            <div className="flex justify-center">
              <button className="w-52 h-8 bg-green-500 text-white rounded" type="submit">
                Register
              </button>
            </div>
          ]}
        />
      </FormProvider>
    </div>
  );
}
