import apiClient from '@/src/services/api';
import { queryClient } from '@/src/services/queryClient';
import {
  getQueuedActions,
  removeActionFromQueue,
  OfflineAction,
} from '@/src/storage/queue.storage';

let isProcessing = false;

export const processQueue = async () => {
  if (isProcessing) return;

  const actions = getQueuedActions();
  if (actions.length === 0) return;

  isProcessing = true;
  console.log(`[Offline] Processing ${actions.length} queued actions...`);

  let hasChanges = false;

  for (const action of actions) {
    try {
      await syncActionWithServer(action);
      removeActionFromQueue(action.id);
      hasChanges = true;
      console.log(
        `[Offline] Successfully synced action: ${action.id} (${action.method} ${action.endpoint})`,
      );
    } catch (error: any) {
      const status = error?.status || error?.response?.status;
      console.error(`[Offline] Failed to sync action: ${action.id}`, {
        status,
        message: error.message,
      });

      if (status && status >= 400 && status < 500) {
        if (status === 401) {
          console.warn('[Offline] Unauthorized (401). Waiting for authentication before syncing.');
          break;
        }
        console.warn(`[Offline] Discarding invalid action ${action.id} due to ${status} error.`);
        removeActionFromQueue(action.id);
        continue;
      }

      console.log('[Offline] Connection issue or server error. Stopping sync queue.');
      break;
    }
  }

  isProcessing = false;

  if (hasChanges) {
    console.log('[Offline] Queue processed. Invalidating queries...');
    await queryClient.invalidateQueries({ queryKey: ['habits'] });
    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }
};

const syncActionWithServer = async (action: OfflineAction) => {
  const { endpoint, method, payload } = action;

  switch (method) {
    case 'POST':
      return apiClient.post(endpoint, payload);
    case 'PUT':
      return apiClient.put(endpoint, payload);
    case 'PATCH':
      return apiClient.patch(endpoint, payload);
    case 'DELETE':
      return apiClient.delete(endpoint);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

export const retryFailedActions = async () => {
  await processQueue();
};
