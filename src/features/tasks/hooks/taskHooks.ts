import { enqueueAction } from '@/src/storage/queue.storage';
import NetInfo from '@react-native-community/netinfo';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CreateTaskData, Task, tasksApi, UpdateTaskData } from '../api/tasks.api';

const TASKS_QUERY_KEY = ['tasks'];

const updateTasksInCache = (queryClient: any, updater: (old: Task[]) => Task[]) => {
  queryClient.setQueriesData({ queryKey: TASKS_QUERY_KEY }, updater);
};

export const useTasks = (params?: object) => {
  return useQuery({
    queryKey: params ? [...TASKS_QUERY_KEY, params] : TASKS_QUERY_KEY,
    queryFn: () => tasksApi.getTasks(params),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData & { tempId?: string }) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');

        const { tempId, ...cleanData } = data as any;
        return await tasksApi.createTask(cleanData);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          // Use the ID generated in onMutate if available
          const finalId = data.tempId || 'temp-' + uuidv4();

          enqueueAction({
            id: uuidv4(),
            endpoint: '/tasks',
            method: 'POST',
            payload: data,
            createdAt: Date.now(),
          });

          // Return a full mock Task object to satisfy TypeScript
          return {
            ...data,
            id: finalId,
            userId: 'offline-user',
            completed: false,
            isPendingSync: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Task;
        }
        throw error;
      }
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Generate the unique ID here so it's consistent
      const tempId = 'temp-' + uuidv4();
      (newTask as any).tempId = tempId;

      const updater = (old: Task[] | undefined) => {
        const tasks = old || [];
        // Check if already exists to prevent duplicates
        if (tasks.find((t) => t.id === tempId)) return tasks;

        return [
          ...tasks,
          {
            ...newTask,
            id: tempId,
            userId: 'offline-user',
            completed: false,
            isPendingSync: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        ];
      };

      updateTasksInCache(queryClient, updater);
      return { previousTasks: queryClient.getQueryData(TASKS_QUERY_KEY) };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        updateTasksInCache(queryClient, () => context.previousTasks as Task[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskData }) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');
        return await tasksApi.updateTask(id, data);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          enqueueAction({
            id: uuidv4(),
            endpoint: `/tasks/${id}`,
            method: 'PUT',
            payload: data,
            createdAt: Date.now(),
          });
          return { id, ...data, isPendingSync: true } as any;
        }
        throw error;
      }
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const updater = (old: Task[] | undefined) => {
        return (old || []).map((t) => (t.id === id ? { ...t, ...data, isPendingSync: true } : t));
      };

      updateTasksInCache(queryClient, updater);
      return { previousTasks: queryClient.getQueryData(TASKS_QUERY_KEY) };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        updateTasksInCache(queryClient, () => context.previousTasks as Task[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');
        return await tasksApi.deleteTask(id);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          enqueueAction({
            id: uuidv4(),
            endpoint: `/tasks/${id}`,
            method: 'DELETE',
            payload: {},
            createdAt: Date.now(),
          });
          return { id, isPendingSync: true };
        }
        throw error;
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      const updater = (old: Task[] | undefined) => {
        return (old || []).filter((t) => t.id !== id);
      };

      updateTasksInCache(queryClient, updater);
      return { previousTasks: queryClient.getQueryData(TASKS_QUERY_KEY) };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        updateTasksInCache(queryClient, () => context.previousTasks as Task[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      }
    },
  });
};
