import type { User } from '@/src/types/User';

const KEYS = {
  TOKEN: '@taskpocket/token',
  USER: '@taskpocket/user',
  SIGNED_OUT: '@taskpocket/signed-out',
} as const;

export function saveToken(token: string): void {
  localStorage.setItem(KEYS.TOKEN, token);
}

export function getToken(): string | null {
  return localStorage.getItem(KEYS.TOKEN);
}

export function saveUser(user: User): void {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function getUser(): User | null {
  const raw = localStorage.getItem(KEYS.USER);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearAuth(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key?.startsWith('@taskpocket') ||
      key?.includes('firebase:auth')
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  localStorage.setItem(KEYS.SIGNED_OUT, 'true');
}

export function clearSignedOutFlag(): void {
  localStorage.removeItem(KEYS.SIGNED_OUT);
}
