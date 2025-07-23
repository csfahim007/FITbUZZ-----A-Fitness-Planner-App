import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const workoutApi = createApi({
  reducerPath: 'workoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/workouts',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Workout'],
  endpoints: (builder) => ({
    getWorkouts: builder.query({
      query: () => '',
      providesTags: ['Workout'],
      transformResponse: (response) => response.data
    }),
    getWorkout: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workout', id }],
      transformResponse: (response) => response.data
    }),
    createWorkout: builder.mutation({
      query: (workout) => ({
        url: '',
        method: 'POST',
        body: workout
      }),
      invalidatesTags: ['Workout'],
      transformResponse: (response) => response.data
    }),
    updateWorkout: builder.mutation({
      query: ({ id, ...workout }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: workout
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workout', id }],
      transformResponse: (response) => response.data
    }),
    deleteWorkout: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Workout'],
      transformResponse: (response) => response.data
    })
  })
});

export const { useGetWorkoutsQuery, useGetWorkoutQuery, useCreateWorkoutMutation, useUpdateWorkoutMutation, useDeleteWorkoutMutation } = workoutApi;