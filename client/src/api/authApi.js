// authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/auth',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token || localStorage.getItem('token');
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      headers.set('Content-Type', 'application/json');
      
      console.log('Request headers:', Object.fromEntries(headers.entries()));
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      console.log('Raw response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
      });
      
      try {
        return JSON.parse(text);
      } catch (err) {
        console.error('Failed to parse JSON response:', err);
        return { error: 'Invalid JSON response', rawBody: text };
      }
    }
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => {
        console.log('Register mutation called with:', userData);
        return {
          url: '/register',
          method: 'POST',
          body: userData,
        };
      },
      transformResponse: (response) => {
        console.log('Register response received:', response);
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Register error response:', {
          response,
          meta,
          arg,
          status: response.status
        });
        
        if (response.data) {
          return {
            status: response.status,
            data: {
              message: response.data.message || 'Registration failed',
              errors: response.data.errors || {},
              success: response.data.success || false
            }
          };
        }
        
        return {
          status: response.status || 500,
          data: {
            message: 'Registration failed - unexpected error format',
            errors: {},
            success: false,
            originalError: response
          }
        };
      }
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        console.log('Login transformResponse:', response);
        // Return the response as-is, let the component handle the data structure
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Login error response:', response);
        return {
          status: response.status,
          data: {
            message: response.data?.message || 'Login failed',
            errors: response.data?.errors || {}
          }
        };
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
} = authApi;