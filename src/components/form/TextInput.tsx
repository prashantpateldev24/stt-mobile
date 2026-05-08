import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Input, InputProps } from '../Input';

interface ControlledInputProps<T extends FieldValues> extends InputProps {
  control: Control<T>;
  name: Path<T>;
}

export const TextInput = <T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input onBlur={onBlur} onChangeText={onChange} value={value} {...props} />
      )}
    />
  );
};
