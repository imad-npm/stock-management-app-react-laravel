import { apiSlice } from 'services/apiSlice';

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    getTransactions: builder.query({
    query:  ({ page = null, queryString = '' } = {}) => {
     const params = [];
  if (page) params.push(`page=${page}`);
  if (queryString) params.push(queryString);
  // Join params with "&" only if there are any
  const qs = params.length ? `${params.join('&')}` : '';
    return `/transactions?${qs}`;
},     providesTags: (result, error, arg) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Transaction', id })), 'Transaction']
          : ['Transaction'],    }),


    getTransactionById: builder.query({
      query: (id) => `/transactions/${id}`,
           providesTags: (result, error, id) => [{ type: 'Transaction', id }],

    }),


    createTransaction: builder.mutation({
      query: (newTransaction) => ({
        url: '/transactions',
        method: 'POST',
        body: newTransaction,
      }),
      invalidatesTags: ['Transaction'],
    }),


    updateTransaction: builder.mutation({
      query: ({ id, updatedTransaction }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: updatedTransaction,
      }),
          invalidatesTags: (result, error, arg) => [{ type: 'Transaction', id: arg.id }],

    }),


    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApiSlice;
