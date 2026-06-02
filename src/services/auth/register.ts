import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from './auth';
import { api } from '../api';
import type { User } from '@/src/types/User';
import { saveToken, saveUser, clearAuth, clearSignedOutFlag } from '../auth-storage';

export interface RegisterParams {
  email: string;
  password: string;
  passwordConfirmation: string;
  fullName: string;
}

export interface RegisterResult {
  user: User;
  token: string;
}

export async function register(params: RegisterParams): Promise<RegisterResult> {
  const { data: user } = await api.post<User>('/user', params);

  try {
    const auth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(auth, params.email, params.password);
    const token = await credential.user.getIdToken();

    saveToken(token);
    saveUser(user);
    clearSignedOutFlag();

    return { user, token };
  } catch (error) {
    clearAuth();
    throw error;
  }
}
