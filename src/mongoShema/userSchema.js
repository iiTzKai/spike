import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserShema = new Schema({
  name: {
    type: String,
    required: 'Please Enter a name',
  },
  email: {
    type: String,
    required: 'Please Enter an Email',
  },
  created_date: {
    type: String,
    default: Date.now(),
  },
});
