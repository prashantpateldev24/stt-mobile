import { mmkvStorage, safeStorage } from './mmkv';
import { AuthUser } from '@/src/features/auth/api/auth.api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveToken = (token: string) => {
  mmkvStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return mmkvStorage.getItem(TOKEN_KEY);
};

export const saveUser = (user: AuthUser) => {
  safeStorage.saveJson(USER_KEY, user);
};

export const getUser = () => {
  return safeStorage.getJson<AuthUser>(USER_KEY);
};

export const clearAuthData = () => {
  mmkvStorage.removeItem(TOKEN_KEY);
  mmkvStorage.removeItem(USER_KEY);
};
