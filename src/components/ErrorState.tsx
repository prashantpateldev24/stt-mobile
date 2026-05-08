import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/src/constants/theme';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: keyof typeof Ionicons.prototype.name;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message,
  onRetry,
  icon = 'alert-circle-outline',
}: ErrorStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon as any} size={64} color="#FF3B30" />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
