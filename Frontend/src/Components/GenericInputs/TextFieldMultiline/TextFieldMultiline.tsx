import { CSSProperties, ReactNode } from "react";
import "./TextFieldMultiline.css";
import { Path, UseFormRegister } from "react-hook-form";
import TextField from "@mui/material/TextField";



interface TextFieldMultilineProps<T> {
  submit: () => void;
  label: string;
  style?: CSSProperties;
  classNameDiv:string
  classNameTextField: string;
  classNameButtonContainer: string;
  classNameButton: string;
  name: string;
  addButtonName:string
  register: UseFormRegister<T>;
  registerName: Path<T>;
  value?: string;
  onChange?:(event:React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextFieldMultiline<T>({
  submit,
  register,
  registerName,
  label,
  name,
  addButtonName,
  style,
  classNameDiv,
  classNameTextField,
  classNameButtonContainer,
  classNameButton,
  value,
  onChange

}: TextFieldMultilineProps<T>): JSX.Element {
  return (
    <form onSubmit={submit}>
      <div className={classNameDiv}>
        <TextField
          label={label}
          className={classNameTextField}
          multiline
          value={value}
          style={style}
          {...register(registerName)}
          
        />
      </div>
      <div className={classNameButtonContainer}>
        <button className={classNameButton} type="submit">{addButtonName}</button>
      </div>
     
    </form>
  );
}
