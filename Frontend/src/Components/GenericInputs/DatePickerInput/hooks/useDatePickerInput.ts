import {
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

export interface DatePickerInputProps<T> {
  name: Path<T>;
  setValue: (name: Path<T>, value: PathValue<T, Path<T>>) => void;
}

export const useDatePickerInput = <T>({
  name,
  setValue,
}: DatePickerInputProps<T>) => {
  const { control } = useFormContext<T>();

  const handleDatePickerClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleDateChange = (date: Date | null) => {
    if (date && !isNaN(date.getTime())) {
      // Create a new Date object and set it to UTC

      const adjustedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );

      // Format the date to ISO string without the time component
      const formattedDate = adjustedDate?.toISOString()?.split("T")[0];

      setValue(name, formattedDate as PathValue<T, Path<T>>); // Use the formatted date string
    } else {
      setValue(name, null);
    }
  };

  return {
    handleDateChange,
    handleDatePickerClick,
    control,
  };
};
