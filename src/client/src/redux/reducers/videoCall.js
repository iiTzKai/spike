import { createSlice } from '@reduxjs/toolkit';

const initialState = { videoCallRoom: null };

const videoCallRoomId = createSlice({
  name: 'VideoCall',
  initialState,
  reducers: {
    setRoomId: (state, action) => {
      state.videoCallRoom = action.payload;
    },
  },
});

export const { setRoomId } = videoCallRoomId.actions;
export default videoCallRoomId.reducer;
