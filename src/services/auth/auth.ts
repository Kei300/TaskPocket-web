import { getAuth, type Auth } from 'firebase/auth';
import { getFirebaseApp } from './firebase';

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    const app = getFirebaseApp();
    authInstance = getAuth(app);
  }
  return authInstance;
}
