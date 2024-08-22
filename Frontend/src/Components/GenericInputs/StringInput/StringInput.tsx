import { Path, UseFormRegister } from "react-hook-form";
import "./StringInput.css";

interface StringInputProps<T> {
  label: string;
  name: string;
  register: UseFormRegister<T>;
  registerName: Path<T>;
  type: string;
}

export function StringInput<T>({
  label,
  name,
  register,
  registerName,
  type,
}: StringInputProps<T>): JSX.Element {
  return (
    <>
      <label className="text-left">{label}</label>
      <input
          className="border-2 h-12 border-gray-400 rounded-xl"
        name={name}
        type={type}
        {...register(registerName as unknown as Path<T>)}
      />
    </>
  );
}
