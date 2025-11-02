import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Transaction', 'User', 'Category'],
  endpoints: (builder) => ({
    // Define common endpoints here, or leave empty and inject into feature-specific slices
  }),
});
