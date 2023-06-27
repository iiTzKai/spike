import { useDispatch, useSelector } from 'react-redux';
import { setReadEmail } from '../../../redux/reducers/emails';

function Email({ email }) {
  const dispatch = useDispatch();
  const handleReadEmail = () => {
    dispatch(setReadEmail(email));
  };
  return (
    <div className="card" onClick={handleReadEmail}>
      <p className="card-title">{email.subject}</p>
      <p className="card-body">
        {email.content ? email.content.slice(0, 50) : null}
        ...
      </p>
      <p className="footer">
        Written by <span className="by-name">{email.sender} </span> on
        {email.date}
        <span className="date">25/05/23</span>
      </p>
    </div>
  );
}

export default Email;
