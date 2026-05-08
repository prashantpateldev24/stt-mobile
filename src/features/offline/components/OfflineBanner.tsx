import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const OfflineBanner = () => {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOffline ? 0 : -100,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [isOffline, translateY]);

  return (
    <Animated.View
      style={[styles.container, { paddingTop: insets.top, transform: [{ translateY }] }]}
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={18} color="#FFF" />
        <Text style={styles.text}>
          {'You are currently offline. Actions will be synced later.'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },
});
