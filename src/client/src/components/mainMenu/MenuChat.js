import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import Chats from './chat/Chats';

export const socket = io('http://localhost:5000');

function MenuChat() {
  const { isLogin, profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const [createChatRoom, setCreateChatRoom] = useState(false);
  const [chartooms, setChatRooms] = useState([]);
  const [emails, setEmails] = useState('');

  useEffect(() => {
    if (isLogin) {
      socket.emit('fetch-chatrooms', {
        email: profile.emailAddresses[0].value,
      });
    } else {
      socket.emit('fetch-chatrooms', { email: userInfo.email });
    }
  }, []);

  useEffect(() => {
    socket.on('fetch-chatrooms', (data) => {
      setChatRooms(null);
      setChatRooms(data);
    });
  }, []);
  console.log(chartooms);

  const handleCreateRoom = () => {
    if (createChatRoom) {
      setCreateChatRoom(false);
    } else {
      setCreateChatRoom(true);
    }
  };

  const handleCrateNewRoom = (e) => {
    if (e.key === 'Enter') {
      const members = emails.split(',');
      if (isLogin) {
        members.push(profile.emailAddresses[0].value);
        socket.emit('create-room', members);
      } else {
        members.push(userInfo.email);
        socket.emit('create-room', members);
      }

      setEmails('');
      setCreateChatRoom(false);
    }
  };

  return (
    <div>
      <button className="create-room" onClick={handleCreateRoom}>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
            ></path>
          </svg>{' '}
          New Chat
        </span>
      </button>

      {createChatRoom ? (
        <input
          type="text"
          placeholder="example@gmail.com, another@gmail.com"
          name="text"
          className="chatroom-input"
          onKeyDownCapture={handleCrateNewRoom}
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
      ) : null}

      {chartooms
        ? chartooms.map((room) => {
            return <Chats key={room.id} room={room} />;
          })
        : null}
    </div>
  );
}

export default MenuChat;
