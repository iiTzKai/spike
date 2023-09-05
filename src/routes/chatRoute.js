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

  app.post('/chat-room-group', async (req, res) => {
    const { members } = req.body;
    const checkmembers = [];
    const checkedmembersid = [];
    const emails = [];

    await Promise.all(
      members.map(async (member) => {
        try {
          const response = await UserCollection.findOne({ email: member });
          checkmembers.push(response);
          checkedmembersid.push(response.id);
          emails.push(response.email);
        } catch (error) {
          console.log(
            '🚀 ~ file: chatRoute.js:85 ~ members.map ~ error:',
            error,
          );
        }
      }),
    );

    const group_chat = new chatRoom({
      name: 'Group Chat',
      users: checkedmembersid,
      emails: emails,
    });

    const chatroom_exist = await ChatRoomCollection.find({
      users: { $all: checkedmembersid },
    });

    if (chatroom_exist.length > 0) {
      res.json('Chat Room already exist with all of this members');
    } else {
      group_chat
        .save()
        .then(async (chat_room) => {
          for (const user of checkedmembersid) {
            try {
              await UserCollection.updateOne(
                { _id: user },
                { $push: { groups: chat_room.id } },
              );
            } catch (error) {
              console.log(
                '🚀 ~ file: chatRoute.js:113 ~ .then ~ error:',
                error,
              );
            }
          }

          res.json(chat_room);
        })
        .catch((error) => {
          console.log(
            '🚀 ~ file: chatRoute.js:108 ~ group_chat.save ~ error:',
            error,
          );
        });
    }
  });
};
