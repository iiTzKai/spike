import { SlEnvolope, SlBubble, SlBubbles, SlCamrecorder } from 'react-icons/sl';

function MenuIcons() {
  return (
    <div className="menu-icons-container">
      <ul>
        <li>
          <SlEnvolope />
        </li>
        <li>
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
