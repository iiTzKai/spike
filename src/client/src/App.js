import { useSelector } from 'react-redux';
import './App.css';
import Header from './components/header/Header';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

function App() {
  const { isLogin } = useSelector((state) => state.googleAuth);
  const { isImapLogin, userInfo } = useSelector((state) => state.imapAuth);
  return (
    <div className="App">
      <Header />
      {isLogin || (isImapLogin && userInfo.authenticationFailed !== true) ? (
        <MainPage />
      ) : (
        <LoginPage />
      )}
    </div>
  );
}

export default App;
