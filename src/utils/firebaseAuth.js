import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import app from '../config/firebase';

// Initialize Firebase Auth
const auth = getAuth(app);

/**
 * Sign in with a custom token (can be used with Clerk)
 * @param {string} token - The custom token
 * @returns {Promise<UserCredential>}
 */
export const signInWithToken = async (token) => {
  try {
    return await signInWithCustomToken(auth, token);
  } catch (error) {
    console.error('Error signing in with custom token:', error);
    throw error;
  }
};

/**
 * Sign in anonymously to Firebase
 * @returns {Promise<UserCredential>}
 */
export const signInAnonymouslyToFirebase = async () => {
  try {
    console.log('Signing in anonymously to Firebase...');
    return await signInAnonymously(auth);
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    return await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export { auth };
