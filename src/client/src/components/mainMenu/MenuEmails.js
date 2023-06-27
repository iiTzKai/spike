import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmails } from '../../redux/reducers/emails';
import Email from './emails/Email';

function MenuEmails() {
  const { emails } = useSelector((state) => state.emailHolder);
  const { isLogin } = useSelector((state) => state.googleAuth);
  const dispatch = useDispatch();

  const handleLoadEmails = () => {
    axios
      .get('/api/google/getemails')
      .then((response) => dispatch(loadEmails(response.data)));
  };

  const handleImapEmails = () => {
    axios
      .get('/api/imap/emails')
      .then((response) => {
        dispatch(loadEmails(response.data));
      })
      .catch((error) => {
        console.log(error);
        localStorage.clear();
        window.location.href = '/';
      });
  };

  return (
    <div className="menu-emails-container">
      {emails ? (
        emails.map((email) => {
          return <Email email={email} />;
        })
      ) : isLogin ? (
        <button
          className="load-emails"
          type="button"
          onClick={handleLoadEmails}
        >
          <svg
            viewBox="0 0 16 16"
            className="bi bi-arrow-repeat"
            fill="currentColor"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
            <path
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              fill-rule="evenodd"
            ></path>
          </svg>
          Load Emails Google
        </button>
      ) : (
        <button
          className="load-emails"
          type="button"
          onClick={handleImapEmails}
        >
          <svg
            viewBox="0 0 16 16"
            className="bi bi-arrow-repeat"
            fill="currentColor"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
            <path
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              fill-rule="evenodd"
            ></path>
          </svg>
          Load Emails Imap
        </button>
      )}
    </div>
  );
}

export default MenuEmails;
