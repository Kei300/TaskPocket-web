'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';

import type { User } from '@/src/types/User';
import { login as loginService, type LoginParams, type LoginResult } from '@/src/services/auth/login';
import {
  register as registerService,
  type RegisterParams,
  type RegisterResult,
} from '@/src/services/auth/register';
import { getToken, getUser, clearAuth, clearSignedOutFlag } from '@/src/services/auth-storage';
import { getFirebaseAuth } from '@/src/services/auth/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (params: LoginParams) => Promise<LoginResult>;
  signUp: (params: RegisterParams) => Promise<RegisterResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialAuthDone = useRef(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const [token, storedUser] = await Promise.all([getToken(), getUser()]);
          if (token && storedUser) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const expMs = (payload.exp ?? 0) * 1000;
              if (expMs > 0 && Date.now() >= expMs) {
                clearAuth();
                setUser(null);
                return;
              }
            } catch {}
            setUser(storedUser);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        if (!initialAuthDone.current) {
          initialAuthDone.current = true;
          setIsLoading(false);
        }
      }
    });
    return unsubscribe;
  }, []);

  const syncUserFromStorage = useCallback(async () => {
    const [token, storedUser] = await Promise.all([getToken(), getUser()]);
    if (token && storedUser) setUser(storedUser);
  }, []);

  const signIn = useCallback(async (params: LoginParams): Promise<LoginResult> => {
    const result = await loginService(params);
    clearSignedOutFlag();
    syncUserFromStorage();
    return result;
  }, [syncUserFromStorage]);

  const signUp = useCallback(async (params: RegisterParams): Promise<RegisterResult> => {
    const result = await registerService(params);
    clearSignedOutFlag();
    syncUserFromStorage();
    return result;
  }, [syncUserFromStorage]);

  const signOut = useCallback(async () => {
    try {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Firebase signOut error:', e);
    }
    clearAuth();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  return ctx;
}
