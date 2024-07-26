import "./DatePickerInput.css";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Controller,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
  UseFormSetValue,
} from "react-hook-form";

export interface DatePickerInputProps<T> {
  name: Path<T>;
  registerOptions: RegisterOptions;
  setValue: (name: Path<T>, value: PathValue<T, Path<T>>) => void;
}

export function DatePickerInput<T>({
  name,
  registerOptions,
  setValue,
}: DatePickerInputProps<T>): JSX.Element {
  const { control } = useFormContext<T>();


  const handleDateChange = (date: Date | null) => {
    
    if (date && !isNaN(date.getTime())) {
      // Create a new Date object and set it to UTC

      const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

      // Format the date to ISO string without the time component
      const formattedDate = adjustedDate?.toISOString()?.split("T")[0];

      setValue(name, formattedDate as PathValue<T, Path<T>>); // Use the formatted date string
    } else {
      setValue(name, null);
    }
  };

  return (
    <div className="flex w-full justify-center m-auto mt-4">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          rules={registerOptions}
          render={({ field }) => (
            <DatePicker
              value={field.value ? field.value as Date : null}
              label="Birthday"
              onChange={(date: Date | null) => {
                handleDateChange(date);
                field.onChange(date);
              }}
              sx={{width: 8000}}
              format="dd/MM/yyyy"
            //   className="w-96 xs:w-48"
              views={["day", "month", "year"]}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
}
