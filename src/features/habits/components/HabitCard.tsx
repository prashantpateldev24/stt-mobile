import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Habit } from '../api/habits.api';
import { StreakBadge } from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onComplete, onDelete, onEdit }: HabitCardProps) => {
  const isCompletedToday = habit.lastCompletedDate
    ? new Date(habit.lastCompletedDate).toDateString() === new Date().toDateString()
    : false;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{habit.name}</Text>

          {(habit as any).isPendingSync && (
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color="#007AFF"
              style={styles.syncIcon}
            />
          )}
        </View>

        <View style={styles.stats}>
          <StreakBadge streak={habit.streak} />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, isCompletedToday && styles.completedButton]}
          onPress={() => !isCompletedToday && onComplete(habit.id)}
          disabled={isCompletedToday}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isCompletedToday ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isCompletedToday ? '#4CAF50' : '#007AFF'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(habit)}>
          <MaterialIcons name="edit" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete?.(habit.id)}>
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIcon: {
    marginLeft: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 4,
    marginRight: 8,
  },
  completedButton: {
    opacity: 0.8,
  },
  deleteButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
    marginRight: 4,
  },
});
