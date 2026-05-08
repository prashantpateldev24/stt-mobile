import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/theme';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.prototype.name;
}

export const EmptyState = ({ title, message, icon = 'document-text-outline' }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={80} color={'#E5E5EA'} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});
