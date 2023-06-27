import { createSlice } from '@reduxjs/toolkit';

const initialState = { isLogin: false, profile: null };

const googleUser = createSlice({
  name: 'googleAuth',
  initialState,
  reducers: {
    setGoogleUser: (state, action) => {
      state.isLogin = true;
      state.profile = action.payload;
    },
    setGoogleUserLogout: (state, action) => {
      state.isLogin = false;
      state.profile = null;
    },
  },
});

export const { setGoogleProfile, setGoogleUser } = googleUser.actions;
export default googleUser.reducer;
