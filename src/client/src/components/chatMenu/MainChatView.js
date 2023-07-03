import { useState } from 'react';
import { SlCursor } from 'react-icons/sl';
import io from 'socket.io-client';
import './MainChatView.css';

const socket = io('http://localhost:5000');

function MainChatView() {
  const [messages, setmessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">Chat</div>
        <div className="chat-window">
          <ul className="message-list"></ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message here"
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
