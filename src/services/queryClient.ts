import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { mmkvStorage } from '@/src/storage/mmkv';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

export const clientPersister = createSyncStoragePersister({
  storage: {
    setItem: (key, value) => mmkvStorage.setItem(key, value),
    getItem: (key) => mmkvStorage.getItem(key),
    removeItem: (key) => mmkvStorage.removeItem(key),
  },
});
