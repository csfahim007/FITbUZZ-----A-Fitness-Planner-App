import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const progressApi = createApi({
  reducerPath: 'progressApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/progress' }),
  tagTypes: ['Progress'],
  endpoints: (builder) => ({
    getProgress: builder.query({
      query: () => '',
      providesTags: ['Progress'],
    }),
    recordProgress: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Progress'],
    }),
    // Add more endpoints
  }),
});