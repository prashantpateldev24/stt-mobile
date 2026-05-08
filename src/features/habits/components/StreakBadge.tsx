import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge = ({ streak }: StreakBadgeProps) => {
  if (streak === 0) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={12} color="#FF9500" />
      <Text style={styles.text}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFECC7',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF9500',
    marginLeft: 4,
  },
});
