import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, portal?: 'STAFF' | 'STUDENT' | 'SUPERADMIN') => Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
  loginWithToken: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'achariya_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });

  // Restore session on mount
  useEffect(() => {
    const savedToken = (() => {
      try { return localStorage.getItem(TOKEN_KEY); }
      catch { return null; }
    })();

    if (!savedToken) {
      setState({ user: null, token: null, isLoading: false });
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${savedToken}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        if (data.success && data.user) {
          setState({ user: data.user, token: savedToken, isLoading: false });
        } else {
          throw new Error('Invalid response');
        }
      })
      .catch(() => {
        try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
        setState({ user: null, token: null, isLoading: false });
      });
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    portal: 'STAFF' | 'STUDENT' | 'SUPERADMIN' = 'STAFF'
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portal })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error ?? 'Login failed.', redirectUrl: data.redirectUrl };
      }

      try { localStorage.setItem(TOKEN_KEY, data.token); } catch { /* ignore */ }
      setState({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  }, []);

  const loginWithToken = useCallback((token: string, user: User) => {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    setState({ user, token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setState({ user: null, token: null, isLoading: false });

    fetch('/api/auth/logout', {
      method: 'POST',
      headers: state.token ? { Authorization: `Bearer ${state.token}` } : {}
    }).catch(() => { /* best-effort */ });
  }, [state.token]);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithToken,
      logout,
      isAuthenticated: !!state.user && !!state.token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
