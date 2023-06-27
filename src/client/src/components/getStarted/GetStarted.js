import { useState } from 'react';
import './GetStarted.css';
import { useDispatch, useSelector } from 'react-redux';
import { setGoogleUser } from '../../redux/reducers/googleUser';
import axios from 'axios';
import { setImapUser } from '../../redux/reducers/imapUser';

function GetStarted() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [imapServer, setImapServer] = useState('imap-mail.outlook.com');
  const [imapPort, setImapPort] = useState('993');
  const [hasGmail, setHasGmail] = useState(false);
  const [advanceSettings, setAdvanceSettings] = useState(false);
  const { isImapLogin } = useSelector((state) => state.imapAuth);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('/api/imap/login', {
        email: email,
        password: pass,
        host: imapServer,
        port: imapPort,
      })
      .then((response) => {
        dispatch(setImapUser(response.data));
        console.log(response);
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = '/googleAuth';
    dispatch(setGoogleUser(null));
  };

  return (
    <div className="popup">
      <form className="form">
        <div className="note">
          <label className="title">Get Started</label>
          <span className="subtitle">
            Login to unlock the full potential of the web app.
          </span>
        </div>
        <input
          placeholder="Enter your e-mail"
          title="Enter your e-mail"
          name="email"
          type="email"
          className="input_field"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setHasGmail(e.target.value.includes('@gmail'));
          }}
        />
        {hasGmail ? (
          <div className="google-btn-login" onClick={handleGoogleLogin}>
            <img src="https://www.google.com/favicon.ico" alt="google icon" />
            <span>Google</span>
          </div>
        ) : (
          <div className="note imap-settings-container">
            <label className="title">Configure IMAP Settings</label>
            <button
              onClick={(e) => {
                setAdvanceSettings(!advanceSettings);
                e.preventDefault();
              }}
              className="imap-settings"
            >
              IMAP Advance Settings
            </button>
            {advanceSettings ? (
              <>
                <label className="title">IMAP Settings</label>
                <input
                  placeholder="Your Password"
                  name="Server"
                  type="password"
                  className="input_field"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <input
                  placeholder="IMAP Server"
                  name="Server"
                  type="text"
                  className="input_field"
                  value={imapServer}
                  onChange={(e) => setImapServer(e.target.value)}
                />
                <input
                  placeholder="IMAP Port"
                  name="Imap-port"
                  type="text"
                  className="input_field"
                  value={imapPort}
                  onChange={(e) => setImapPort(e.target.value)}
                />
                <button className="submit" onClick={handleSubmit}>
                  Submit
                </button>
              </>
            ) : null}
          </div>
        )}
      </form>
    </div>
  );
}

export default GetStarted;
