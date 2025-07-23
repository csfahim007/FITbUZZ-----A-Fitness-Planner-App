import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/exercises',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Exercise'],
  endpoints: (builder) => ({
    getExercises: builder.query({
      query: () => '',
      providesTags: ['Exercise'],
      transformResponse: (response) => response.data
    }),
    getExercise: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exercise', id }],
      transformResponse: (response) => response.data
    }),
    createExercise: builder.mutation({
      query: (exercise) => ({
        url: '',
        method: 'POST',
        body: exercise
      }),
      invalidatesTags: ['Exercise'],
      transformResponse: (response) => response.data
    })
  })
});

export const { useGetExercisesQuery, useGetExerciseQuery, useCreateExerciseMutation } = exerciseApi;