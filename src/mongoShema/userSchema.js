import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserShema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  groups: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_date: {
    type: String,
    default: Date.now(),
  },
});
