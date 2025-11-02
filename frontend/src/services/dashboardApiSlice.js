import { apiSlice } from 'services/apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard','Product','Transaction'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;
