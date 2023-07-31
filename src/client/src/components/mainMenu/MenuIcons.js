import { SlEnvolope, SlBubble, SlBubbles, SlCamrecorder } from 'react-icons/sl';
import { useDispatch, useSelector } from 'react-redux';
import { ReadEmails, ShowChat } from '../../redux/reducers/showNav';

function MenuIcons() {
  const dispatch = useDispatch();
  const handleReadEmailNav = () => {
    dispatch(ReadEmails());
  };
  const handleChat = () => {
    dispatch(ShowChat());
  };

  return (
    <div className="menu-icons-container">
      <ul>
        <li onClick={handleReadEmailNav}>
          <SlEnvolope />
        </li>
        <li onClick={handleChat}>
          <SlBubble />
        </li>
        <li>
          <SlBubbles />
        </li>
        <li>
          <SlCamrecorder />
        </li>
      </ul>
    </div>
  );
}

export default MenuIcons;
