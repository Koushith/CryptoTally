import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from './api';
import authReducer from './authSlice';

/**
 * Redux Persist Configuration
 *
 * Persists auth state to localStorage for persistence across refreshes
 * Now safe to persist entire auth state since user is serializable
 */
const persistConfig = {
  key: 'cryptotally-auth',
  storage,
  // Persist everything except loading state
  blacklist: ['loading'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

/**
 * Redux Store Configuration
 *
 * Combines RTK Query API and auth slice with persistence
 */
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

// Setup listeners for automatic refetching
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
