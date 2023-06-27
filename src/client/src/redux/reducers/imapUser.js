import { createSlice } from '@reduxjs/toolkit';

const initialState = { isImapLogin: false, userInfo: null };

const imapUser = createSlice({
  name: 'imapAuth',
  initialState,
  reducers: {
    setImapUser: (state, action) => {
      state.isImapLogin = true;
      state.userInfo = action.payload;
    },

    setImapUserLogout: (state) => {
      state.isImapLogin = false;
      state.userInfo = null;
    },
  },
});

export const { setImapUser, setImapUserLogout } = imapUser.actions;
export default imapUser.reducer;
