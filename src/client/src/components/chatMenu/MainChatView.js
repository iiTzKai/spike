import { useEffect, useRef, useState } from 'react';
import { SlCamrecorder, SlCursor } from 'react-icons/sl';
import io from 'socket.io-client';
import './MainChatView.css';
import { useDispatch, useSelector } from 'react-redux';
import Email from '../mainMenu/emails/Email';
import { socket } from '../mainMenu/MenuChat';
import { ShowVideoCall } from '../../redux/reducers/showNav';
import { setRoomId } from '../../redux/reducers/videoCall';

// const socket = io('http://localhost:5000');

function MainChatView() {
  const { readEmail } = useSelector((state) => state.emailHolder);
  const { isLogin, profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState(null);
  const [sender, setSender] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('');
  const [myId, setMyId] = useState('');
  const messageListRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setSender(userInfo.email);
      socket.emit('get-myid', { email: userInfo.email });
    } else {
      setSender(profile.emailAddresses[0].value);
      socket.emit('get-myid', { email: profile.emailAddresses[0].value });
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

    socket.on('get-myid', (data) => {
      setMyId(data.userid);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    console.log(history, 'HEREEEEE');
    if (userInfo) {
      socket.emit('get-myid', { email: userInfo.email });
    } else {
      socket.emit('get-myid', { email: profile.emailAddresses[0].value });
    }

    if (currentRoom) {
      dispatch(setRoomId(currentRoom));
    }
  }, [history, currentRoom]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  });

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

  const handleVideoCall = () => {
    socket.emit('message', {
      roomID: currentRoom,
      sender: sender,
      message: `Call started ${Date.now()}`,
    });
    dispatch(ShowVideoCall());
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          Chat: {currentRoom ? currentRoom : null}
          {currentRoom ? (
            <div className="video-call-container" onClick={handleVideoCall}>
              <SlCamrecorder />
            </div>
          ) : null}
        </div>
        <div className="chat-window">
          <ul className="message-list">
            {readEmail ? (
              <li>
                <Email email={readEmail} />
              </li>
            ) : null}
            {history
              ? history.map((historyMessage, index) => {
                  if (historyMessage.sender === myId) {
                    return (
                      <li key={index} className="sender-message">
                        {historyMessage.message}
                      </li>
                    );
                  } else {
                    return (
                      <li key={index} className="not-sender-message">
                        {historyMessage.message}
                      </li>
                    );
                  }
                })
              : null}
            <div ref={messageListRef}></div>
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
