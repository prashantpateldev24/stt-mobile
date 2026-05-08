import { safeStorage } from './mmkv';
import { Habit } from '@/src/features/habits/api/habits.api';

const HABITS_KEY = 'offline_habits';

export const saveOfflineHabits = (habits: Habit[]) => {
  safeStorage.saveJson(HABITS_KEY, habits);
};

export const getOfflineHabits = (): Habit[] => {
  return safeStorage.getJson<Habit[]>(HABITS_KEY) || [];
};

export const clearOfflineHabits = () => {
  safeStorage.saveJson(HABITS_KEY, []);
};
