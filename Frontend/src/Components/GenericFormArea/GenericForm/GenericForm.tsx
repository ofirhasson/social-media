import { UseFormHandleSubmit } from "react-hook-form";
import "./GenericForm.css";
import React from "react";

interface FormProps<T> {
    header?: string;
    submit: () => Promise<void>;
    inputs: React.ReactNode[];
    buttonName: string;
  }
  
  export function GenericForm<T>({
    header,
    inputs,
    submit,
    buttonName,
  }: FormProps<T>): JSX.Element {
    return (
      <div className="flex flex-col justify-center items-center mt-7 xxs:m-2">
        <form
          onSubmit={submit}
          className="h-auto bg-gray-600 bg-opacity-5 rounded-3xl md:w-6/12 lg:w-6/12 xs:w-8/12 xxs:w-8/12 py-10 px-10 mb-10"
        >
        <p className="font-bold font-mono text-4xl">{header}</p>
          <div className="md:flex md:items-center mb-6">
            <div className="flex flex-col justify-center w-full">
              {inputs.map((input, index) => (
                <React.Fragment key={index}>{input}</React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="md:w-3/3 flex gap-x-4">
              <button
                className="text-black-500 bg-green-400 hover:bg-purple-400  shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                type="submit"
              >
                {buttonName}
              </button>
              <button
                type="reset"
                className="text-black-500 bg-yellow-400  hover:bg-purple-400  shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
