import { useDispatch } from 'react-redux';
import { clearReadEmail } from '../../../redux/reducers/emails';
import { useState } from 'react';
import { socket } from '../MenuChat';

function Chats({ room }) {
  const dispatch = useDispatch();
  const handleChatRoomChannel = () => {
    socket.emit('join-room', { room: room._id });
    socket.emit('fetch-history', room._id);
    dispatch(clearReadEmail());
  };

  return (
    <>
      <div className="card" onClick={handleChatRoomChannel}>
        <p className="card-title">{room.name}</p>
      </div>
    </>
  );
}

export default Chats;