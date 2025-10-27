import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Auth Service
 *
 * Handles Firebase authentication and syncs with PostgreSQL backend
 */
export class AuthService {
  /**
   * Sign in with Google
   */
  static async signInWithGoogle(): Promise<UserCredential> {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Sync user with backend
      await this.syncUserWithBackend(result.user);

      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  static async signInWithEmail(
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Sync user with backend
      await this.syncUserWithBackend(result.user);

      return result;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
      }

      // Sync user with backend
      await this.syncUserWithBackend(result.user, name);

      return result;
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   * Clears Firebase session, local storage, and notifies backend to send Clear-Site-Data header
   */
  static async signOut(): Promise<void> {
    try {
      // Get token before signing out
      const token = await this.getIdToken();

      // Sign out from Firebase
      await signOut(auth);

      // Notify backend to send Clear-Site-Data header (MDN recommended approach)
      if (token) {
        try {
          await fetch(`${API_URL}/api/auth/signout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Backend signout error:', error);
          // Continue with local cleanup even if backend call fails
        }
      }

      // Clear all localStorage (including redux-persist)
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear cookies if any (for good measure)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Force reload to reset all state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Get current user's ID token
   */
  static async getIdToken(forceRefresh = false): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  }

  /**
   * Sync Firebase user with PostgreSQL backend
   * This creates/updates user record in PostgreSQL
   */
  private static async syncUserWithBackend(
    user: User,
    displayName?: string
  ): Promise<void> {
    try {
      const idToken = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
          name: displayName || user.displayName,
          photoUrl: user.photoURL,
          emailVerified: user.emailVerified,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }

      const data = await response.json();
      console.log('User synced with backend:', data);
    } catch (error) {
      console.error('Backend sync error:', error);
      // Don't throw - allow user to continue even if backend sync fails
    }
  }
}
