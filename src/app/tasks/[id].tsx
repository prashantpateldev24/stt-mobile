import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTasks, useUpdateTask } from '@/src/features/tasks/hooks/taskHooks';
import { TaskForm } from '@/src/features/tasks/components/TaskForm';
import { TaskFormData } from '@/src/features/tasks/schemas/taskSchema';
import { mapApiErrorsToForm } from '@/src/utils/error';
import { ApiError } from '@/src/services/api';
import { UseFormSetError } from 'react-hook-form';

const EditTaskScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const task = tasks.find((t) => t.id === id);

  const handleSubmit = (data: TaskFormData, setError: UseFormSetError<TaskFormData>) => {
    if (!id) return;
    updateTask(
      { id, data },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (error: any) => {
          mapApiErrorsToForm(error as ApiError, setError);
        },
      },
    );
  };

  if (isTasksLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {task && (
        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          buttonTitle="Update Task"
        />
      )}
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
