import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateTask } from '@/src/features/tasks/hooks/taskHooks';
import { TaskForm } from '@/src/features/tasks/components/TaskForm';
import { TaskFormData } from '@/src/features/tasks/schemas/taskSchema';
import { mapApiErrorsToForm } from '@/src/utils/error';
import { ApiError } from '@/src/services/api';
import { UseFormSetError } from 'react-hook-form';

const CreateTaskScreen = () => {
  const router = useRouter();
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (data: TaskFormData, setError: UseFormSetError<TaskFormData>) => {
    createTask(data, {
      onSuccess: () => {
        router.dismiss();
      },
      onError: (error: any) => {
        mapApiErrorsToForm(error as ApiError, setError);
      },
    });
  };

  return (
    <View style={styles.container}>
      <TaskForm onSubmit={handleSubmit} isLoading={isPending} buttonTitle="Create Task" />
    </View>
  );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
