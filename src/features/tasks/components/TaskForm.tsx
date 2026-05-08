import { StyleSheet, ScrollView } from 'react-native';
import { useForm, UseFormSetError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { taskSchema, TaskFormData } from '../schemas/taskSchema';
import { TextInput } from '@/src/components/form/TextInput';
import { DatePickerTextInput } from '@/src/components/form/DatePickerTextInput';
import { AppButton } from '@/src/components/form/AppButton';
import { Task } from '../api/tasks.api';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (data: TaskFormData, setError: UseFormSetError<TaskFormData>) => void;
  isLoading: boolean;
  buttonTitle: string;
}

export const TaskForm = ({ initialValues, onSubmit, isLoading, buttonTitle }: TaskFormProps) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema) as any,
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      dueDate: initialValues?.dueDate || new Date().toISOString(),
      priority: initialValues?.priority || 'medium',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        control={control}
        name="title"
        label="Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
      />

      <TextInput
        control={control}
        name="description"
        label="Description"
        placeholder="Add some details..."
        multiline
        numberOfLines={3}
        style={styles.textArea}
        error={errors.description?.message}
      />

      <DatePickerTextInput
        control={control}
        name="dueDate"
        label="Due Date"
        error={errors.dueDate?.message}
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
    padding: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
  },
});
