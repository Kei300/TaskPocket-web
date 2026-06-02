import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from './auth';
import { api } from '../api';
import type { User } from '@/src/types/User';
import { saveToken, saveUser, clearAuth, clearSignedOutFlag } from '../auth-storage';

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export async function login({ email, password }: LoginParams): Promise<LoginResult> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdToken();

  try {
    const { data } = await api.get<User>('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = data;

    saveToken(token);
    saveUser(user);
    clearSignedOutFlag();

    return { user, token };
  } catch (error) {
    await auth.signOut();
    clearAuth();
    throw error;
  }
}
