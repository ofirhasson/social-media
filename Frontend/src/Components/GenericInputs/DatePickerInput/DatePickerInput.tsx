import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Controller,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { useDatePickerInput } from "./hooks/useDatePickerInput";

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
  const { control, handleDateChange, handleDatePickerClick } =
    useDatePickerInput<T>({ name, setValue });

  return (
    <div
      className="flex w-full justify-center m-auto mt-4"
      onClick={() => handleDatePickerClick}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={name}
          control={control}
          rules={registerOptions}
          render={({ field }) => (
            <DatePicker
              value={field.value ? (field.value as Date) : null}
              label="Birthday"
              onChange={(date: Date | null) => {
                handleDateChange(date);
                field.onChange(date);
              }}
              sx={{ width: "100%" }}
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
