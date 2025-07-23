import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const nutritionApi = createApi({
  reducerPath: 'nutritionApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/nutrition',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Nutrition'],
  endpoints: (builder) => ({
    getNutritionLogs: builder.query({
      query: (date) => `?date=${date}`,
      providesTags: ['Nutrition'],
      transformResponse: (response) => response || []
    }),
    logNutrition: builder.mutation({
      query: (entry) => ({
        url: '',
        method: 'POST',
        body: entry,
      }),
      invalidatesTags: ['Nutrition'],
    }),
    updateNutritionLog: builder.mutation({
      query: ({ id, ...entry }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: entry,
      }),
      invalidatesTags: ['Nutrition'],
    }),
    deleteNutritionLog: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Nutrition'],
    }),
  }),
});

export const {
  useGetNutritionLogsQuery,
  useLogNutritionMutation,
  useUpdateNutritionLogMutation,
  useDeleteNutritionLogMutation
} = nutritionApi;