import mongoose from 'mongoose';
import { UserShema } from '../mongoShema/userSchema';

const User = mongoose.model('Users', UserShema);
const FindUser = mongoose.model('Users');

export const addNewUser = async (req, res) => {
  let newUser = new User(req.body);
  const reqEmail = req.body.email;

  try {
    const userExist = await FindUser.findOne({ email: reqEmail });

    if (userExist) {
      res.json({ exist: true });
    } else {
      newUser.save().then((user) => {
        res.json(user);
      });
    }
  } catch (error) {
    console.log('🚀 ~ file: userController.js:14 ~ addNewUser ~ error:', error);
  }
};
