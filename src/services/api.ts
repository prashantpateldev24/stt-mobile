import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { mmkvStorage } from '@/src/storage/mmkv';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[] | string>;
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = mmkvStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      mmkvStorage.removeItem('auth_token');
      mmkvStorage.removeItem('user_data');
    }
    return Promise.reject(normalizeError(error));
  },
);

export const normalizeError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message:
          error.response.data?.message || error.response.data?.error || 'Server error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        message: 'Unable to connect to the server. Please check your internet.',
        code: 'NETWORK_ERROR',
      };
    }
  }

  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const api = {
  get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }),
  post: <T>(url: string, data?: object) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: object) => apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: object) => apiClient.patch<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};

export default apiClient;
