import constate from 'constate';
import { useEffect, useState } from 'react';

import * as authStorage from '@/src/storage/auth.storage';
import { AuthUser } from '../api/auth.api';

const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = authStorage.getToken();
        const storedUser = authStorage.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          authStorage.clearAuthData();
        }
      } catch (error) {
        console.error('[Auth] Session restoration failed:', error);
        authStorage.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = (newToken: string, userData: AuthUser) => {
    if (!newToken || !userData) {
      console.error('[Auth] Cannot sign in with missing token or user data');
      return;
    }
    authStorage.saveToken(newToken);
    authStorage.saveUser(userData);
    setToken(newToken);
    setUser(userData);
  };

  const signOut = () => {
    authStorage.clearAuthData();
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    signIn,
    signOut,
  };
};

export const [AuthProvider, useAuthContext] = constate(useAuth);
