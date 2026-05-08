import { useMemo } from 'react';
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import { Task } from '../api/tasks.api';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskList = ({
  tasks,
  isLoading,
  isRefreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps) => {
  const sections = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};

    tasks.forEach((task) => {
      const dateStr = task.dueDate ? new Date(task.dueDate).toDateString() : 'No Date';
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(task);
    });

    return Object.keys(groups)
      .map((date) => ({
        title: date,
        data: groups[date],
      }))
      .sort((a, b) => {
        if (a.title === 'No Date') return 1;
        if (b.title === 'No Date') return -1;
        return new Date(a.title).getTime() - new Date(b.title).getTime();
      });
  }, [tasks]);

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard task={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            {title === new Date().toDateString() ? 'Today' : title}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{'No tasks found. Create one to get started!'}</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  sectionHeader: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
  },
});
