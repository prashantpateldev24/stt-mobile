import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Task } from '../api/tasks.api';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, task.completed && styles.completedText]} numberOfLines={1}>
            {task.title}
          </Text>

          {(task as any).isPendingSync && (
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color="#007AFF"
              style={styles.syncIcon}
            />
          )}
        </View>

        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggle(task.id, !task.completed)}
        >
          <Ionicons
            name={task.completed ? 'checkbox' : 'square-outline'}
            size={24}
            color={task.completed ? '#4CAF50' : '#757575'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(task)}>
          <MaterialIcons name="edit" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
          <Ionicons name="trash-outline" size={18} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    marginLeft: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  description: {
    fontSize: 12,
    color: '#616161',
  },
  deleteButton: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 4,
  },
});
