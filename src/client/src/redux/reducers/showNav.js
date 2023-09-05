import { createSlice } from '@reduxjs/toolkit';

const initialState = { currentView: 'readEmail' };

const navComponent = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    ReadEmails: (state) => {
      state.currentView = 'readEmail';
    },
    ShowChat: (state) => {
      state.currentView = 'chat';
    },
    ShowVideoCall: (state) => {
      state.currentView = 'videocall';
    },
  },
});

export const { ReadEmails, ShowChat, ShowVideoCall } = navComponent.actions;
export default navComponent.reducer;
