/**
 * Authentication Service
 *
 * Wraps @react-native-firebase/auth to provide typed helper functions
 * for register, login, logout and observing auth state changes.
 */
import auth from '@react-native-firebase/auth';
import { User } from '../types';

// ── Register ─────────────────────────────────────────────────────────────────

export const registerWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const credential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  const { uid, email: userEmail, displayName } = credential.user;
  return { uid, email: userEmail ?? email, displayName: displayName ?? undefined };
};

// ── Login ────────────────────────────────────────────────────────────────────

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  const { uid, email: userEmail, displayName } = credential.user;
  return { uid, email: userEmail ?? email, displayName: displayName ?? undefined };
};

// ── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (): Promise<void> => {
  await auth().signOut();
};

// ── Auth State Observer ───────────────────────────────────────────────────────

/**
 * Subscribe to Firebase auth state changes.
 * Returns an unsubscribe function — call it inside a useEffect cleanup.
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void,
): (() => void) => {
  return auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      const { uid, email, displayName } = firebaseUser;
      callback({
        uid,
        email: email ?? '',
        displayName: displayName ?? undefined,
      });
    } else {
      callback(null);
    }
  });
};
