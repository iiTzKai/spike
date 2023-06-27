import { useSelector } from 'react-redux';
import MenuEmails from './MenuEmails';
import MenuHeader from './MenuHeader';
import './MenuHeader.css';
import MenuIcons from './MenuIcons';
import ReadEmailView from './emails/ReadEmailView';

function MainMenu() {
  return (
    <div className="menu-container">
      <MenuHeader />
      <MenuIcons />
      <MenuEmails />
    </div>
  );
}

export default MainMenu;
