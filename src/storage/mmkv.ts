import { createMMKV, type MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

const createStorageInstance = (): MMKV | null => {
  try {
    if (Platform.OS === 'web') return null;
    return createMMKV({
      id: 'app-storage',
      encryptionKey: 'some-secret-key',
    });
  } catch (error) {
    console.warn('MMKV not available, falling back to in-memory storage', error);
    return null;
  }
};

export const storage = createStorageInstance();
const memoryStorage = new Map<string, string>();

/**
 * Basic MMKV wrapper with fallback and safe methods
 */
export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    if (value === undefined || value === null) {
      mmkvStorage.removeItem(key);
      return;
    }
    if (storage) {
      storage.set(key, value);
    } else {
      memoryStorage.set(key, value);
    }
  },
  getItem: (key: string) => {
    if (storage) {
      return storage.getString(key) ?? null;
    }
    return memoryStorage.get(key) ?? null;
  },
  removeItem: (key: string) => {
    if (storage) {
      storage.remove(key);
    } else {
      memoryStorage.delete(key);
    }
  },
  clearAll: () => {
    if (storage) {
      storage.clearAll();
    } else {
      memoryStorage.clear();
    }
  },
};

/**
 * Safe JSON Helpers
 */
export const safeStorage = {
  saveJson: <T>(key: string, value: T) => {
    try {
      const stringValue = JSON.stringify(value);
      mmkvStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Error saving JSON to key "${key}":`, error);
    }
  },
  getJson: <T>(key: string): T | null => {
    try {
      const stringValue = mmkvStorage.getItem(key);
      if (!stringValue) return null;
      return JSON.parse(stringValue) as T;
    } catch (error) {
      console.error(`Error parsing JSON from key "${key}":`, error);
      // If corrupted, remove it to prevent future crashes
      mmkvStorage.removeItem(key);
      return null;
    }
  },
};
