import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppDispatch } from '@/store/hooks';
import { setUser, clearUser, setLoading, SerializableUser } from '@/store/authSlice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

/**
 * Auth Provider Component
 *
 * Wraps app to provide auth state to all components
 * Syncs Firebase auth with Redux store
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoadingState] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // Get ID token
          const token = await firebaseUser.getIdToken();

          // Extract only serializable user data for Redux
          const serializableUser: SerializableUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          };

          // Update local state (Firebase User object stays here)
          setUserState(firebaseUser);
          setLoadingState(false);
          setError(null);

          // Sync with Redux (only serializable data)
          dispatch(setUser({ user: serializableUser, token }));
        } else {
          // Clear local state
          setUserState(null);
          setLoadingState(false);

          // Clear Redux
          dispatch(clearUser());
        }
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error as Error);
        setLoadingState(false);
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 *
 * Access current user and auth state in any component
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useAuth();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Not logged in</div>;
 *
 *   return <div>Welcome {user.displayName}</div>;
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
