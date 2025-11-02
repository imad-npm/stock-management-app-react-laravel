import { apiSlice } from 'services/apiSlice';
import { removeToken, setToken } from 'store/authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
          // Use onQueryStarted to set the token in your authSlice after a successful login
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data.user and data.token are assumed from your backend response
          dispatch(setToken({ token: data.token }));
        } catch (err) {
          console.log(err);
        }
      },

    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // Wait for the server request to complete
          dispatch(removeToken());
            dispatch(apiSlice.util.resetApiState()); // 💣 flush all cached queries

        } catch (err) {
          console.log(err);
        }
      },

    }),

    getProfile : builder.query({
      query :()=>'/profile' ,
      providesTags :['Profile']
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags :['Profile'] ,

      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          dispatch(updateUser(data.data));
        } catch (err) {
          console.log(err);
        }
      },


    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation,useGetProfileQuery, useUpdateProfileMutation } = authApiSlice;
