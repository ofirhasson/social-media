import { CSSProperties, memo, ReactNode, useEffect, useState } from "react";
import "./TextFieldMultiline.css";
import { Path, UseFormRegister, UseFormSetValue } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface TextFieldMultilineProps<T> {
    submit: () => void;
    label: string;
    style?: CSSProperties;
    classNameDiv: string;
    classNameTextField: string;
    classNameButtonContainer: string;
    classNameButton: string;
    name: string;
    addButtonName: string;
    register: UseFormRegister<T>;
    registerName: Path<T>;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    defaultValue?: string;
}

function TextFieldMultilineComponent<T>({
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
    //   value,
    onChange,
    defaultValue,
}: TextFieldMultilineProps<T>): JSX.Element {

    // console.log(defaultValue);
    
    const [value, setValue] = useState<string>('' || defaultValue);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    };

    return (
        <form onSubmit={submit}>
            <div className={classNameDiv}>
                <TextField
                    label={label}
                    className={classNameTextField}
                    multiline
                    // value={value}
                    style={style}
                    {...register(registerName as unknown as Path<T>)}
                    onChange={handleChange}
                />
            </div>
            <div className={classNameButtonContainer}>
                <button className={classNameButton} type="submit">
                    {addButtonName}
                </button>
            </div>
        </form>
    );
}

export const TextFieldMultiline = memo(TextFieldMultilineComponent) as typeof TextFieldMultilineComponent