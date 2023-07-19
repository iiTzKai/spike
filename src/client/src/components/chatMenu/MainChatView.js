import { useEffect, useState } from 'react';
import { SlCursor } from 'react-icons/sl';
import io from 'socket.io-client';
import './MainChatView.css';
import { useSelector } from 'react-redux';
import Email from '../mainMenu/emails/Email';

const socket = io('http://localhost:5000');

function MainChatView() {
  const { readEmail } = useSelector((state) => state.emailHolder);
  const { isLogin, profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sender, setSender] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');

  useEffect(() => {
    if (isLogin) {
      socket.emit('join', [readEmail.sender, profile.emailAddresses[0].value]);
      setSender(profile.emailAddresses[0].value);
    } else {
      socket.emit('join', [readEmail.sender, userInfo.email]);
      setSender(userInfo.email);
    }
  }, [readEmail]);

  useEffect(() => {
    socket.on('current_room', (roomID) => {
      setCurrentRoom(roomID);
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  });

  const handleSendMessage = () => {
    if (message) {
      socket.emit('message', {
        roomID: currentRoom,
        sender: sender,
        message: message,
      });
    }
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">Chat</div>
        <div className="chat-window">
          <ul className="message-list">
            {readEmail ? (
              <li>
                <Email email={readEmail} />
              </li>
            ) : null}
          </ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message here"
            multiple={true}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="send-button">
            <SlCursor />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainChatView;
