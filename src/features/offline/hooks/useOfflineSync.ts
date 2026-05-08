import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { processQueue } from '../services/offlineQueue.service';

export const useOfflineSync = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('[Offline] Network restored. Starting sync...');
        processQueue();
      }
    });

    // Initial check on mount
    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.isInternetReachable) {
        processQueue();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
