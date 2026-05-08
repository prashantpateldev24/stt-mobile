import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetInfoState | null>(null);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setStatus(state);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isOffline = status !== null && (!status.isConnected || !status.isInternetReachable);
  const isOnline = status !== null && status.isConnected && status.isInternetReachable;

  return {
    status,
    isOffline,
    isOnline,
  };
};
