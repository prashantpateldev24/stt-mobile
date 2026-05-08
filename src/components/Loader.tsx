import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/theme';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader = ({ message, fullScreen = true }: LoaderProps) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.tint} />
      {message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});
