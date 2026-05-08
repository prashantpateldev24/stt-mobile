import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskList } from '@/src/features/tasks/components/TaskList';
import { ErrorState } from '@/src/components/ErrorState';
import { Task } from '@/src/features/tasks/api/tasks.api';
import { useTasks, useUpdateTask, useDeleteTask } from '@/src/features/tasks/hooks/taskHooks';

const TasksScreen = () => {
  const router = useRouter();
  const { data: tasks = [], isLoading, error, refetch, isRefetching } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  if (error) {
    console.error('[TasksScreen] Failed to fetch tasks:', error);
  }

  const handleToggle = (id: string, completed: boolean) => {
    updateTask({ id, data: { completed } });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTask(id),
      },
    ]);
  };

  const handlePressTask = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  if (error && tasks.length === 0) {
    return (
      <ErrorState message={(error as any).message || 'Failed to load tasks'} onRetry={refetch} />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handlePressTask}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/tasks/create')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
