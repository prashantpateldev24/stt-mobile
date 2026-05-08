import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { DateInput } from '../DateInput';

interface ControlledDateInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
}

export const DatePickerTextInput = <T extends FieldValues>({
  control,
  name,
  label,
  error,
}: ControlledDateInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <DateInput label={label} value={value} onChange={onChange} error={error} />
      )}
    />
  );
};
