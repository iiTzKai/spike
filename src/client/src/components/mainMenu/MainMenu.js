import { useSelector } from 'react-redux';
import MenuEmails from './MenuEmails';
import MenuHeader from './MenuHeader';
import './MenuHeader.css';
import MenuIcons from './MenuIcons';
import ReadEmailView from './emails/ReadEmailView';
import MenuChat from './MenuChat';

function MainMenu() {
  const { currentView } = useSelector((state) => state.navigation);
  return (
    <div className="menu-container">
      <MenuHeader />
      <MenuIcons />
      {currentView === 'readEmail' && <MenuEmails />}
      {currentView === 'chat' && <MenuChat />}
    </div>
  );
}

export default MainMenu;
