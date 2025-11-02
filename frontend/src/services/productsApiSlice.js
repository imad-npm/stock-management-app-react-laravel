import { apiSlice } from 'services/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    
    getProducts: builder.query({
      query:  ({ page = '', queryString = '' } = {}) => {
      const params = [];
  if (page) params.push(`page=${page}`);
  if (queryString) params.push(queryString);
  // Join params with "&" only if there are any
  const qs = params.length ? `${params.join('&')}` : '';

    return `/products?${qs}`;
},      providesTags: (result, error, arg) =>
        result
          ? [...result.data.map(({ id }) => ({ type: 'Product', id })), 'Product']
          : ['Product'],
    }),


    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],

    }),



    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),


    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],

    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
