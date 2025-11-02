import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token') },
  reducers: {
    setToken(state, action) {
      const { token } = action.payload;
  
      state.token = token;
      localStorage.setItem('token', token);
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
 

  },
});

export const { setToken, removeToken } = authSlice.actions;

export default authSlice.reducer;

export const selectToken = (state) => state.auth.token;
