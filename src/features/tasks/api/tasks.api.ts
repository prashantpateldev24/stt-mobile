import { api } from '@/src/services/api';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
}

export type CreateTaskData = Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskData = Partial<CreateTaskData> & { completed?: boolean };

export const tasksApi = {
  getTasks: async (params?: object) => {
    const response = await api.get<{ success: boolean; data: Task[] }>('/tasks', params);
    return response.data.data;
  },

  createTask: async (data: CreateTaskData) => {
    const response = await api.post<{ success: boolean; data: Task }>('/tasks', data);
    return response.data.data;
  },

  updateTask: async (id: string, data: UpdateTaskData) => {
    const response = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, data);
    return response.data.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(`/tasks/${id}`);
    return response.data;
  },
};
