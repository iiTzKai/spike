import { useDispatch, useSelector } from 'react-redux';
import { setReadEmail } from '../../../redux/reducers/emails';
import { socket } from '../MenuChat';

function Email({ email, showAll }) {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  const handleReadEmail = () => {
    if (userInfo) {
      socket.emit('join-room-email', {
        myEmail: userInfo.email,
        receiverEmail: email.sender,
      });
    } else {
      socket.emit('join-room-email', {
        myEmail: profile.emailAddresses[0].value,
        receiverEmail: email.sender,
      });
    }
    dispatch(setReadEmail(email));
  };
  return (
    <div className="card" onClick={handleReadEmail}>
      <p className="card-title">{email.subject}</p>
      <p className="card-body">
        {showAll
          ? email
            ? email.content
            : null
          : email.content
          ? email.content.slice(0, 50) + '...'
          : null}
      </p>
      <p className="footer">
        Written by <span className="by-name">{email.sender} </span>
        <span className="date"> on {email.date}</span>
      </p>
    </div>
  );
}

export default Email;
