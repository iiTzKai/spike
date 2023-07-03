import mongoose from 'mongoose';
import { ChatRoomSchema } from '../mongoShema/chatRoomSchema';

const chatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const UserCollection = mongoose.model('Users');
const ChatRoomCollection = mongoose.model('ChatRoom');

export const chatRoute = (app) => {
  app.post('/chat-room', async (req, res) => {
    const { sender, reciever } = req.body;
    const recieverCheck = await UserCollection.findOne({ email: reciever });
    const senderCheck = await UserCollection.findOne({ email: sender });

    if (recieverCheck && senderCheck) {
      const chatroom = new chatRoom({
        name: 'Test',
        users: [recieverCheck._id, senderCheck._id],
      });

      const chatroom_exist = await ChatRoomCollection.find({
        users: { $all: [recieverCheck.id, senderCheck.id] },
      });

      if (chatroom_exist[0]) {
        res.json('Room already exist with the users');
      } else {
        chatroom
          .save()
          .then((room) => {
            UserCollection.updateOne(
              { email: sender },
              { $push: { groups: room.id } },
            ).catch((error) => {
              res.json(error);
            });
            UserCollection.updateOne(
              { email: reciever },
              { $push: { groups: room.id } },
            ).catch((error) => {
              res.json(error);
            });
            res.json({
              groupid: room.id,
              name: 'Test',
              members: [recieverCheck._id, senderCheck._id],
              success: true,
            });
          })
          .catch((error) => {
            console.log(
              '🚀 ~ file: chatRoute.js:20 ~ app.post ~ error:',
              error,
            );
          });
      }
    } else {
      res.status(500).send('Error no user found with that email');
    }
  });
};
