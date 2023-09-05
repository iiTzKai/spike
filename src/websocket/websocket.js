import mongoose from 'mongoose';
import { ChatRoomSchema } from '../mongoShema/chatRoomSchema';
import { MessageSchema } from '../mongoShema/messageShema';

const chatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const messageSchema = mongoose.model('Messages', MessageSchema);

const ChatRoomCollection = mongoose.model('ChatRoom');
const UserCollection = mongoose.model('Users');
const MessageCollection = mongoose.model('Messages');

const users = {};

const socketToRoom = {};

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

    socket.on('join-room-email', async (data) => {
      await ChatRoomCollection.find({
        emails: { $all: [data.myEmail, data.receiverEmail] },
      }).then((room) => {
        io.to(data.room).emit('current_room', room[0].id);
        socket.emit('current_room', room[0].id);
        console.log(`Room joined ${data.room}`);
      });
    });

    socket.on('fetch-chatrooms', async (data) => {
      const chatrooms = await ChatRoomCollection.find({
        emails: { $in: data.email },
      });
      socket.join(data.email);
      io.to(data.email).emit('fetch-chatrooms', chatrooms);
    });

    socket.on('get-myid', async (data) => {
      try {
        await UserCollection.find({ email: data.email }).then((user) => {
          socket.emit('get-myid', { userid: user[0].id });
        });
      } catch (error) {
        console.log('🚀 ~ file: websocket.js:152 ~ socket.on ~ error:', error);
      }
    });

    //webrtc not used

    socket.on('offer', (data) => {
      socket.to(data.room).emit('offer', data.signalData);
    });

    socket.on('answer', (data) => {
      socket.to(data.room).emit('answer', data.signalData);
    });

    socket.on('ice-candidate', (data) => {
      socket.to(data.room).emit('ice-candidate', data.candidate);
    });

    socket.on('socket-me', (socket) => {
      socket.emit('socket-me', socket.id);
    });

    socket.on('callUser', (data) => {
      console.log('user called');
      socket.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    socket.on('join-call', (room) => {
      socket.join(room.room);
      console.log('User joined room:', room.room);
    });

    socket.on('answerCall', (data) => {
      socket.to(data.to).emit('callAccepted', data.signal);
    });

    // another Video Call test

    socket.on('join room', (roomID) => {
      console.log('🚀 ~ file: websocket.js:207 ~ socket.on ~ roomID:', roomID);
      if (users[roomID]) {
        users[roomID].push(socket.id);
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

      socket.emit('all users', usersInThisRoom);
    });

    socket.on('leave room', (roomID) => {
      const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
      users[roomID] = usersInThisRoom;
      socket.emit('all users', usersInThisRoom);
      console.log(
        '🚀 ~ file: websocket.js:223 ~ socket.on ~ usersInThisRoom:',
        usersInThisRoom,
      );
    });

    socket.on('sending signal', (payload) => {
      io.to(payload.userToSignal).emit('user joined', {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on('returning signal', (payload) => {
      io.to(payload.callerID).emit('receiving returned signal', {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
