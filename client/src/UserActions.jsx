import React, { useState } from 'react';

function UserActions({ onPremiumToggle, premiumMode }) {
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:3001';

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/';
      } else {
        setMessage('Logout failed.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setMessage('Logout failed.');
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={handleLogout} style={{ flex: 1 }}>
          Log Out
        </button>
        {onPremiumToggle && (
          <button onClick={onPremiumToggle} style={{ flex: 1 }}>
            {premiumMode ? 'Disable Premium' : 'Enable Premium'}
          </button>
        )}
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default UserActions;
