import mongoose from 'mongoose';
import { ChatRoomSchema } from '../mongoShema/chatRoomSchema';
import { MessageSchema } from '../mongoShema/messageShema';

const chatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const ChatRoomCollection = mongoose.model('ChatRoom');
const UserCollection = mongoose.model('Users');

export const RTCwebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`user login in ${socket.id}`);

    // Join chanel using a uid of group in mongodb
    socket.on('join', async (userEmails) => {
      const userIDs = [];

      await Promise.all(
        userEmails.map(async (userEmail) => {
          await UserCollection.findOne({ email: userEmail })
            .then((response) => {
              userIDs.push(response);
            })
            .catch((error) => {
              console.log(
                '🚀 ~ file: websocket.js:33 ~ userEmails.map ~ error:',
                error,
              );
            });
        }),
      );

      const chatroom_exist = await ChatRoomCollection.find({
        emails: { $all: userEmails },
      });

      if (chatroom_exist[0]) {
        // fetch all the message in the db and render it to the front end sort it with date
        socket.join(chatroom_exist[0].id);
        socket.emit('current_room', { room: chatroom_exist[0].id });
        console.log('Join chatroom ' + chatroom_exist[0].id);
      } else {
        const chat_room = new chatRoom({
          name: 'Chat RTC test',
          emails: userEmails,
        });

        chat_room.save().then(async (room) => {
          for (const user of userIDs) {
            try {
              await UserCollection.updateOne(
                { _id: user },
                { $push: { groups: room.id } },
              );
              socket.join(room.id);
              socket.emit('current_room', { room: room.id });
            } catch (error) {
              console.log(
                '🚀 ~ file: websocket.js:57 ~ chat_room.save ~ error:',
                error,
              );
            }
          }
        });
      }
    });

    socket.on('message', async (data) => {
      const { roomID, sender, message } = data;

      try {
        const newMessage = new MessageSchema({
          sender: sender,
          message: message,
          ToGroup: roomID,
        });

        await newMessage.save();
        io.to(roomID).emit('message', newMessage);
      } catch (error) {
        console.log('🚀 ~ file: websocket.js:90 ~ socket.on ~ error:', error);
      }
    });

    socket.on('fetch_history', async (userEmails) => {
      const userIDs = [];

      await Promise.all(
        userEmails.map(async (userEmail) => {
          try {
            const response = await UserCollection.find({ email: userEmail });
            userIDs.push(response.id);
          } catch (error) {
            console.log(
              '🚀 ~ file: websocket.js:23 ~ awaitPromise.all ~ error:',
              error,
            );
          }
        }),
      );
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
