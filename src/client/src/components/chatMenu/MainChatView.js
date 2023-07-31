import { useEffect, useState } from 'react';
import { SlCursor } from 'react-icons/sl';
import io from 'socket.io-client';
import './MainChatView.css';
import { useSelector } from 'react-redux';
import Email from '../mainMenu/emails/Email';
import { socket } from '../mainMenu/MenuChat';

// const socket = io('http://localhost:5000');

function MainChatView() {
  const { readEmail } = useSelector((state) => state.emailHolder);
  const { isLogin, profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(null);
  const [sender, setSender] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('');

  useEffect(() => {
    if (userInfo) {
      setSender(userInfo.email);
    } else {
      setSender(profile.emailAddresses[0].value);
    }
  }, []);

  useEffect(() => {
    socket.on('current_room', (roomID) => {
      setCurrentRoom(roomID);
    });

    socket.on('fetch-history', (data) => {
      setHistory(data);
    });

    socket.on('message', (message) => {
      setHistory((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    console.log(history, 'HEREEEEE');
  }, [history]);

  const handleSendMessage = () => {
    if (message) {
      socket.emit('message', {
        roomID: currentRoom,
        sender: sender,
        message: message,
      });
      setMessage('');
    }
  };

  const handleSendMessageEnter = (e) => {
    if (e.key === 'Enter') {
      console.log(sender);
      if (message) {
        socket.emit('message', {
          roomID: currentRoom,
          sender: sender,
          message: message,
        });
        setMessage('');
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          Chat: {currentRoom ? currentRoom : null}
        </div>
        <div className="chat-window">
          <ul className="message-list">
            {readEmail ? (
              <li>
                <Email email={readEmail} />
              </li>
            ) : null}
            {history
              ? history.map((historyMessage, index) => (
                  <li key={index}>{historyMessage.message}</li>
                ))
              : null}
          </ul>
        </div>
        <div className="chat-input">
          {currentRoom ? (
            <>
              <input
                type="text"
                className="message-input"
                placeholder="Type your message here"
                multiple={true}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                value={message}
                onKeyDownCapture={handleSendMessageEnter}
              />
              <button className="send-button" onClick={handleSendMessage}>
                <SlCursor />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MainChatView;
