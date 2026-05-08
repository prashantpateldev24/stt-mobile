import { safeStorage } from './mmkv';

const QUEUE_KEY = 'offline_action_queue';

export interface OfflineAction {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload: any;
  createdAt: number;
}

export const enqueueAction = (action: OfflineAction) => {
  const currentQueue = getQueuedActions();
  // Prevent duplicate actions with same ID (if applicable)
  if (currentQueue.find((a) => a.id === action.id)) return;

  safeStorage.saveJson(QUEUE_KEY, [...currentQueue, action]);
};

export const getQueuedActions = (): OfflineAction[] => {
  return safeStorage.getJson<OfflineAction[]>(QUEUE_KEY) || [];
};

export const removeActionFromQueue = (actionId: string) => {
  const currentQueue = getQueuedActions();
  const updatedQueue = currentQueue.filter((a) => a.id !== actionId);
  safeStorage.saveJson(QUEUE_KEY, updatedQueue);
};

export const clearQueue = () => {
  safeStorage.saveJson(QUEUE_KEY, []);
};
