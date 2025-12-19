/**
 * Authentication Store
 * Zustand store for authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setAuth: (token, userId) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({ token, userId, isAuthenticated: true });
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        set({ token: null, userId: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ary-auth-storage',
    }
  )
);

