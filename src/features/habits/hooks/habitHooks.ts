import NetInfo from '@react-native-community/netinfo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { enqueueAction } from '@/src/storage/queue.storage';
import { CreateHabitData, Habit, habitsApi, UpdateHabitData } from '../api/habits.api';

const HABITS_QUERY_KEY = ['habits'];

const updateHabitsInCache = (queryClient: any, updater: (old: Habit[]) => Habit[]) => {
  queryClient.setQueryData(HABITS_QUERY_KEY, updater);
};

export const useHabits = () => {
  return useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: () => habitsApi.getHabits(),
  });
};

export const useCompleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');
        return await habitsApi.completeHabit(id);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          enqueueAction({
            id: uuidv4(),
            endpoint: `/habits/${id}/complete`,
            method: 'POST',
            payload: {},
            createdAt: Date.now(),
          });
          return { id, isPendingSync: true } as any;
        }
        throw error;
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });

      const updater = (old: Habit[] | undefined) => {
        return (old || []).map((h) =>
          h.id === id
            ? {
              ...h,
              streak: (h.streak || 0) + 1,
              lastCompletedDate: new Date().toISOString(),
              isPendingSync: true,
            }
            : h,
        );
      };

      updateHabitsInCache(queryClient, updater);

      // Also update the detail query if it exists
      queryClient.setQueryData([...HABITS_QUERY_KEY, id], (old: Habit | undefined) => {
        if (!old) return old;
        return {
          ...old,
          streak: (old.streak || 0) + 1,
          lastCompletedDate: new Date().toISOString(),
          isPendingSync: true,
        };
      });

      return { previousHabits: queryClient.getQueryData(HABITS_QUERY_KEY) };
    },
    onError: (err, id, context) => {
      if (context?.previousHabits) {
        updateHabitsInCache(queryClient, () => context.previousHabits as Habit[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHabitData & { tempId?: string }) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');

        // Remove tempId before sending to API to avoid 400 errors
        const { tempId, ...cleanData } = data as any;
        return await habitsApi.createHabit(cleanData);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          const finalId = data.tempId || 'temp-' + uuidv4();
          enqueueAction({
            id: uuidv4(),
            endpoint: '/habits',
            method: 'POST',
            payload: data,
            createdAt: Date.now(),
          });

          // Return a full mock Habit object to satisfy TypeScript
          return {
            ...data,
            id: finalId,
            userId: 'offline-user', // Mock userId
            streak: 0,
            lastCompletedDate: null,
            isPendingSync: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Habit;
        }
        throw error;
      }
    },
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });

      const tempId = 'temp-' + uuidv4();
      (newHabit as any).tempId = tempId;

      const updater = (old: Habit[] | undefined) => {
        const habits = old || [];
        if (habits.find((h) => h.id === tempId)) return habits;

        return [
          ...habits,
          {
            ...newHabit,
            id: tempId,
            userId: 'offline-user',
            streak: 0,
            lastCompletedDate: null,
            isPendingSync: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        ];
      };

      updateHabitsInCache(queryClient, updater);
      return { previousHabits: queryClient.getQueryData(HABITS_QUERY_KEY) };
    },
    onError: (err, newHabit, context) => {
      if (context?.previousHabits) {
        updateHabitsInCache(queryClient, () => context.previousHabits as Habit[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
};

export const useHabit = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...HABITS_QUERY_KEY, id],
    queryFn: async () => {
      const habits = queryClient.getQueryData<Habit[]>(HABITS_QUERY_KEY);
      const habit = habits?.find((h) => h.id === id);
      if (habit) return habit;
      return habitsApi.getHabitById(id);
    },
    enabled: !!id,
    initialData: () => {
      const habits = queryClient.getQueryData<Habit[]>(HABITS_QUERY_KEY);
      return habits?.find((h) => h.id === id);
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHabitData }) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');
        return await habitsApi.updateHabit(id, data);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          enqueueAction({
            id: uuidv4(),
            endpoint: `/habits/${id}`,
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
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });

      const updater = (old: Habit[] | undefined) => {
        return (old || []).map((h) => (h.id === id ? { ...h, ...data, isPendingSync: true } : h));
      };

      updateHabitsInCache(queryClient, updater);


      queryClient.setQueryData([...HABITS_QUERY_KEY, id], (old: Habit | undefined) => {
        if (!old) return old;
        return { ...old, ...data, isPendingSync: true };
      });

      return { previousHabits: queryClient.getQueryData(HABITS_QUERY_KEY) };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        updateHabitsInCache(queryClient, () => context.previousHabits as Habit[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) throw new Error('OFFLINE');
        return await habitsApi.deleteHabit(id);
      } catch (error: any) {
        if (error.message === 'OFFLINE' || error.code === 'NETWORK_ERROR' || !error.status) {
          enqueueAction({
            id: uuidv4(),
            endpoint: `/habits/${id}`,
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
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEY });

      const updater = (old: Habit[] | undefined) => {
        return (old || []).filter((h) => h.id !== id);
      };

      updateHabitsInCache(queryClient, updater);
      return { previousHabits: queryClient.getQueryData(HABITS_QUERY_KEY) };
    },
    onError: (err, id, context) => {
      if (context?.previousHabits) {
        updateHabitsInCache(queryClient, () => context.previousHabits as Habit[]);
      }
    },
    onSettled: async (data) => {
      if (data && !(data as any).isPendingSync) {
        await queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
      }
    },
  });
};
