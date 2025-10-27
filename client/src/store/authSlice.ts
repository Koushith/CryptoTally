import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Serializable User Data
 * Only stores plain data, no methods or circular references
 */
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
};

/**
 * Auth Slice
 *
 * Manages authentication state with Redux
 * Persisted to localStorage for auth persistence across refreshes
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: SerializableUser; token: string }>) => {
      // User is already serializable (extracted in useAuth hook)
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, updateToken } = authSlice.actions;
export default authSlice.reducer;
