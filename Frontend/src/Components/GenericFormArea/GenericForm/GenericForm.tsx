import React from "react";

interface FormProps<T> {
  submit: () => Promise<void>;
  inputs: React.ReactNode[];
}

export function GenericForm<T>({ inputs, submit }: FormProps<T>): JSX.Element {
  return (
    <form
      onSubmit={submit}
      className={
        "h-auto relative bg-white bg-opacity-85 flex flex-col justify-center m-auto rounded-3xl md:mr-2 maxWLg:w-80 xxs:w-8/12 py-10 px-10 mb-10"
      }
    >
      <div className="md:flex md:items-center mb-6">
        <div className="flex flex-col justify-center m-auto w-full">
          {inputs.map((input, index) => (
            <React.Fragment key={index}>{input}</React.Fragment>
          ))}
        </div>
      </div>
    </form>
  );
}
