import { useDispatch, useSelector } from 'react-redux';

function MenuHeader() {
  const { profile } = useSelector((state) => state.googleAuth);
  const { userInfo } = useSelector((state) => state.imapAuth);
  return (
    <div className="menu-header">
      <h3>
        {profile
          ? profile.names[0].displayName
          : userInfo
          ? userInfo.name
          : null}
      </h3>
      <h4>
        {profile
          ? profile.emailAddresses[0].value
          : userInfo
          ? userInfo.email
          : null}
      </h4>
    </div>
  );
}

export default MenuHeader;
