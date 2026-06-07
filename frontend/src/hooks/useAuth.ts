// Auth hook manages the current session, token persistence, and role-aware workspace access.
import { useEffect, useState } from 'react';
import { clearStoredToken, getCurrentUser, getStoredToken, login, register } from '../api';
import type { AuthUser } from '../types';

type AuthStatus = 'checking' | 'anonymous' | 'authenticated';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    if (!getStoredToken()) {
      setStatus('anonymous');
      return;
    }

    void getCurrentUser()
      .then((response) => {
        setUser(response.user);
        setStatus('authenticated');
      })
      .catch(() => {
        clearStoredToken();
        setStatus('anonymous');
      });
  }, []);

  async function registerAccount(payload: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    company: string;
  }) {
    const response = await register(payload);
    setUser(response.user);
    setStatus('authenticated');
  }

  async function loginAccount(payload: { identifier: string; password: string }) {
    const response = await login(payload);
    setUser(response.user);
    setStatus('authenticated');
  }

  function logout() {
    clearStoredToken();
    setUser(null);
    setStatus('anonymous');
  }

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated' && Boolean(user),
    registerAccount,
    loginAccount,
    logout
  };
}

