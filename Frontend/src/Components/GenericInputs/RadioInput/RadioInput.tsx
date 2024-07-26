import React, { ChangeEvent } from "react";
import { Controller, Path, PathValue, useFormContext } from "react-hook-form";

interface RadioInputProps<T> {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  setValue: (name: Path<T>, value:string) => void;
}

export function RadioInput<T>({
  name,
  label,
  options,
  setValue
}: RadioInputProps<T>): JSX.Element {
  const { control } = useFormContext<T>();

  return (
    <div className="mb-4 mt-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  id={option.value}
                  type="radio"
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={(e:ChangeEvent<HTMLInputElement>) => {
                    setValue(name, e.target.value); // Use setValue prop
                    field.onChange(e.target.value);
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
