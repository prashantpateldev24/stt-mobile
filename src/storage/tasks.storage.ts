import { safeStorage } from './mmkv';
import { Task } from '@/src/features/tasks/api/tasks.api';

const TASKS_KEY = 'offline_tasks';

export const saveOfflineTasks = (tasks: Task[]) => {
  safeStorage.saveJson(TASKS_KEY, tasks);
};

export const getOfflineTasks = (): Task[] => {
  return safeStorage.getJson<Task[]>(TASKS_KEY) || [];
};

export const clearOfflineTasks = () => {
  safeStorage.saveJson(TASKS_KEY, []);
};
