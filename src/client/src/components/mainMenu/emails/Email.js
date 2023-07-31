import { useDispatch, useSelector } from 'react-redux';
import { setReadEmail } from '../../../redux/reducers/emails';

function Email({ email, showAll }) {
  const dispatch = useDispatch();
  const handleReadEmail = () => {
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
