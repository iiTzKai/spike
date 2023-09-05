import { useEffect } from 'react';
import axios from 'axios';
import './PageStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { setGoogleUser } from '../redux/reducers/googleUser';
import MainMenu from '../components/mainMenu/MainMenu';
import ReadEmailView from '../components/mainMenu/emails/ReadEmailView';
import MainChatView from '../components/chatMenu/MainChatView';
import CallVideo from '../components/callvideo/CallVideo';
import VideoCall from '../components/callvideo/VideoCall';

function MainPage() {
  const { profile, isLogin } = useSelector((state) => state.googleAuth);
  const { currentView } = useSelector((state) => state.navigation);
  const { videoCallRoom } = useSelector((state) => state.videoCall);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile === !null) return;

    if (isLogin) {
      axios
        .get('/api/getgoogleuserinfo')
        .then((response) => {
          dispatch(setGoogleUser(response.data));
          axios
            .post('/api/mongodb/users', {
              email: response.data.emailAddresses[0].value,
              name: response.data.names[0].displayName,
            })
            .catch((err) => {
              console.log('🚀 ~ file: MainPage.js:30 ~ useEffect ~ err:', err);
            });
        })
        .catch((err) => {
          window.location.href = '/googleAuth';
          console.log('🚀 ~ file: MainPage.js:14 ~ useEffect ~ err:', err);
        });
    } else {
    }
  }, []);

  return (
    <div className="main-page-container">
      <MainMenu />
      {currentView === 'readEmail' && <ReadEmailView />}
      {currentView === 'chat' && <MainChatView />}
      {/* {currentView === 'videocall' && <CallVideo />} */}
      {currentView === 'videocall' && videoCallRoom !== null && (
        <VideoCall roomID={videoCallRoom} />
      )}
    </div>
  );
}

export default MainPage;
