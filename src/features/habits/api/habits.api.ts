import { api } from '@/src/services/api';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  streak: number;
  lastCompletedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateHabitData = { name: string };
export type UpdateHabitData = Partial<CreateHabitData>;

export const habitsApi = {
  getHabits: async () => {
    const response = await api.get<{ success: boolean; data: Habit[] }>('/habits');
    return response.data.data;
  },

  getHabitById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Habit }>(`/habits/${id}`);
    return response.data.data;
  },

  createHabit: async (data: CreateHabitData) => {
    const response = await api.post<{ success: boolean; data: Habit }>('/habits', data);
    return response.data.data;
  },

  updateHabit: async (id: string, data: UpdateHabitData) => {
    const response = await api.put<{ success: boolean; data: Habit }>(`/habits/${id}`, data);
    return response.data.data;
  },

  completeHabit: async (id: string) => {
    const response = await api.post<{ success: boolean; data: Habit }>(`/habits/${id}/complete`);
    return response.data.data;
  },

  deleteHabit: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(`/habits/${id}`);
    return response.data;
  },
};
