import { useEffect, useRef, useState } from 'react';
import { socket } from '../mainMenu/MenuChat';
import { SlCallOut } from 'react-icons/sl';
import Peer from 'simple-peer';
import './VideoCall.css';

function VideoCall({ roomID }) {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  //const roomID = 'Test';

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socket.emit('join room', roomID);

        socket.on('all users', (users) => {
          console.log(users, 'LEAVE ROOM');
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({ peerID: userID, peer });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socket.on('user joined', (payload) => {
          console.log(
            '🚀 ~ file: VideoCall.js:29 ~ socket.on ~ payload:',
            payload,
          );
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
          console.log('USERS joined ' + peers);
        });

        socket.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
      props.peer.on('stream', (stream) => {
        ref.current.srcObject = stream;
      });
    }, []);

    return <video playsInline autoPlay ref={ref} className="persons-video" />;
  };

  const handleLeaveCall = () => {
    socket.emit('leave room', roomID);
  };

  return (
    <div className="video-call-container-component">
      <div className="persons-container">
        <video
          muted
          ref={userVideo}
          autoPlay
          playsInline
          className="persons-video"
        ></video>

        {peers.map((peer, index) => {
          return <Video key={index} peer={peer} />;
        })}
      </div>
      <span onClick={handleLeaveCall}>
        <SlCallOut className="end-call" />
      </span>
    </div>
  );
}

export default VideoCall;
