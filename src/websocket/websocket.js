import mongoose from 'mongoose';
import { ChatRoomSchema } from '../mongoShema/chatRoomSchema';
import { MessageSchema } from '../mongoShema/messageShema';

const chatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const messageSchema = mongoose.model('Messages', MessageSchema);

const ChatRoomCollection = mongoose.model('ChatRoom');
const UserCollection = mongoose.model('Users');
const MessageCollection = mongoose.model('Messages');

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
        // fetch all the message in the db and render i    t to the front end sort it with date
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

      await UserCollection.find({ email: sender }).then(async (emailInfo) => {
        console.log(
          '🚀 ~ file: websocket.js:74 ~ awaitUserCollection.find ~ emailInfo:',
          emailInfo[0].id,
        );
        try {
          const newMessage = new messageSchema({
            sender: emailInfo[0].id,
            message: message,
            ToGroup: roomID,
          });

          await newMessage.save();
          io.to(roomID).emit('message', newMessage);
        } catch (error) {
          console.log('🚀 ~ file: websocket.js:90 ~ socket.on ~ error:', error);
        }
      });
    });

    socket.on('create-room', async (members) => {
      const chatroom_exist = await ChatRoomCollection.find({
        emails: { $all: members },
      });

      if (chatroom_exist[0]) {
        return;
      } else {
        const chat_room = new chatRoom({
          name: 'Chat RTC test tmq',
          emails: members,
        });

        chat_room.save().then(async (room) => {
          for (const user in members) {
            console.log(
              '🚀 ~ file: websocket.js:99 ~ chat_room.save ~ user:',
              members[user],
            );
            try {
              await UserCollection.updateOne(
                { email: members[user] },
                { $push: { groups: room.id } },
              );
            } catch (error) {
              console.log(
                '🚀 ~ file: websocket.js:100 ~ chat_room.save ~ error:',
                error,
              );
            }
          }
        });
      }
    });

    socket.on('fetch-history', async (roomID) => {
      const roomMessages = await MessageCollection.find({ ToGroup: roomID });
      io.to(roomID).emit('fetch-history', roomMessages);
    });

    socket.on('join-room', (data) => {
      socket.join(data.room);
      io.to(data.room).emit('current_room', data.room);
      socket.emit('current_room', data.room);
      console.log(`Room joined ${data.room}`);
    });

    socket.on('fetch-chatrooms', async (data) => {
      const chatrooms = await ChatRoomCollection.find({
        emails: { $in: data.email },
      });
      socket.join(data.email);
      io.to(data.email).emit('fetch-chatrooms', chatrooms);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
