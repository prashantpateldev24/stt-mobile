import { StyleSheet, ScrollView } from 'react-native';
import { useForm, UseFormSetError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { habitSchema, HabitFormData } from '../schemas/habitSchema';
import { TextInput } from '@/src/components/form/TextInput';
import { AppButton } from '@/src/components/form/AppButton';
import { Habit } from '@/src/features/habits/api/habits.api';

interface HabitFormProps {
  initialValues?: Partial<Habit>;
  onSubmit: (data: HabitFormData, setError: UseFormSetError<HabitFormData>) => void;
  isLoading: boolean;
  buttonTitle: string;
}

export const HabitForm = ({ initialValues, onSubmit, isLoading, buttonTitle }: HabitFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: yupResolver(habitSchema) as any,
    defaultValues: {
      name: initialValues?.name || '',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        control={control}
        name="name"
        label="Habit Name"
        placeholder="e.g., Morning Run"
        error={errors.name?.message}
      />

      <AppButton
        title={buttonTitle}
        onPress={handleSubmit((data) => onSubmit(data, setError))}
        isLoading={isLoading}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});
