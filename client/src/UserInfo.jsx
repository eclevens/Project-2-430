import React from 'react';
import UserActions from './UserActions.jsx';
import CollageList from './CollageList.jsx';

function UserInfo({ onLoadCollage, onPremiumToggle, premiumMode }) {
  return (
    <div
      className="user-info-sidebar"
      style={{
        width: '250px',
        minWidth: '200px',
        borderRight: '1px solid #ccc',
        padding: '10px',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <h3>User Center</h3>

      {/* Logout + Premium buttons */}
      <UserActions
        onPremiumToggle={onPremiumToggle}
        premiumMode={premiumMode}
      />

      {/* Collage list */}
      <CollageList onLoadCollage={onLoadCollage} />
    </div>
  );
}

export default UserInfo;
