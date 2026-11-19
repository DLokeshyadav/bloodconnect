import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { tokenStore } from '../lib/tokenStore';
import type { ApiError, CurrentUser, LoginResponse } from '../types';
import { AuthContext, type AuthContextValue, type AuthStatus } from './authContext';

/**
 * Manages BloodConnect session state across page reloads, sign-in, registration, and sign-out.
 *
 *   App loads -> saved token? -- no --> anonymous
 *                   | yes
 *                   v
 *              fetchCurrentUser -- ok --> authenticated
 *                   |
 *                 401/invalid --> clear token & anonymous
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() => (tokenStore.get() ? 'loading' : 'anonymous'));

  const resetSessionState = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
    void queryClient.cancelQueries().finally(() => {
      queryClient.clear(); // prevent previous user's cached queries from leaking across accounts
    });
  }, [queryClient]);

  const handleUnauthorized = useCallback(() => {
    tokenStore.clear();
    resetSessionState();
  }, [resetSessionState]);

  // Restore the session from a saved token on initial load
  useEffect(() => {
    if (status !== 'loading') return;
    if (!tokenStore.get()) {
      resetSessionState();
      return;
    }

    let cancelled = false;
    authApi
      .fetchCurrentUser()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const apiError = error as Partial<ApiError> | undefined;
        if (apiError?.status === 401 || apiError?.status === 403 || !tokenStore.get()) {
          handleUnauthorized();
          return;
        }
        // Keep token on transient backend/network errors so a brief outage doesn't wipe the session
        setUser(null);
        setStatus('anonymous');
      });

    return () => {
      cancelled = true;
    };
  }, [status, handleUnauthorized, resetSessionState]);

  // The API client calls this when any request receives a 401 (expired or invalid token)
  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(null);
  }, [handleUnauthorized]);

  const startSession = useCallback((response: LoginResponse, remember: boolean) => {
    tokenStore.set(response.token, remember);
    setUser(response.user);
    setStatus('authenticated');
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe: remember,
      });
      startSession(response, remember);
      return response.user;
    },
    [startSession],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    resetSessionState();
  }, [resetSessionState]);

  const refreshUser = useCallback(async () => {
    const updated = await authApi.fetchCurrentUser();
    setUser(updated);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      login,
      startSession,
      logout,
      refreshUser,
    }),
    [user, status, login, startSession, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}