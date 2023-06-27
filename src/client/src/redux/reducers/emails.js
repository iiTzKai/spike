import { createSlice } from '@reduxjs/toolkit';

const initialState = { emails: null, readEmail: null };

const emailsHolder = createSlice({
  name: 'Emails',
  initialState,
  reducers: {
    loadEmails: (state, action) => {
      state.emails = action.payload;
    },
    clearEmails: (state) => {
      state.emails = null;
    },
    setReadEmail: (state, action) => {
      state.readEmail = action.payload;
    },
    clearReadEmail: (state) => {
      state.readEmail = null;
    },
  },
});

export const { loadEmails, clearEmails, setReadEmail, clearReadEmail } =
  emailsHolder.actions;
export default emailsHolder.reducer;
