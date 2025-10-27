import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { AuthService } from '@/services/auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * RTK Query API Service
 *
 * Centralized API configuration with automatic token injection
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: async (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as RootState).auth.token;
      
      // If no token in state, try to get from Firebase
      const idToken = token || await AuthService.getIdToken();
      
      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Feedback', 'Waitlist'],
  endpoints: (builder) => ({
    // Auth endpoints
    syncUser: builder.mutation<
      { success: boolean; data: any },
      { firebaseUid: string; email: string; name?: string; photoUrl?: string; emailVerified: boolean }
    >({
      query: (userData) => ({
        url: '/auth/sync',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getProfile: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    verifyToken: builder.query<{ success: boolean; data: any }, void>({
      query: () => '/auth/verify',
    }),

    // Feedback endpoints (public)
    getFeedback: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => '/feedback',
      providesTags: ['Feedback'],
    }),

    submitFeedback: builder.mutation<
      { success: boolean; data: any },
      { name?: string; email?: string; type: string; message: string }
    >({
      query: (feedback) => ({
        url: '/feedback',
        method: 'POST',
        body: feedback,
      }),
      invalidatesTags: ['Feedback'],
    }),

    // Waitlist endpoints (public)
    joinWaitlist: builder.mutation<
      { success: boolean; data: any; message?: string },
      {
        email: string;
        name?: string;
        userType?: string;
        companyName?: string;
        teamSize?: string;
        paymentVolume?: string;
        useCase?: string;
        source?: string;
        referralSource?: string;
      }
    >({
      query: (waitlistData) => ({
        url: '/waitlist',
        method: 'POST',
        body: waitlistData,
      }),
      invalidatesTags: ['Waitlist'],
    }),
  }),
});

export const {
  useSyncUserMutation,
  useGetProfileQuery,
  useVerifyTokenQuery,
  useGetFeedbackQuery,
  useSubmitFeedbackMutation,
  useJoinWaitlistMutation,
} = api;
