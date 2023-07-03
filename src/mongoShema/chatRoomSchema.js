import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ChatRoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
});
