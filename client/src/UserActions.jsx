import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserActions({ onPremiumToggle, premiumMode }) {
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:3001';
  const navigate = useNavigate(); // hook for navigation

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


  const handleAbout = () => {
    navigate('/about'); // redirect to /about page
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        <button onClick={handleLogout} style={{ flex: 1 }}>
          Log Out
        </button>
        {onPremiumToggle && (
          <button onClick={onPremiumToggle} style={{ flex: 1 }}>
            {premiumMode ? 'Disable Premium' : 'Enable Premium'}
          </button>
        )}
      </div>

      <button
        onClick={handleAbout}
        style={{
          width: '100%',
          padding: '8px',
          cursor: 'pointer',
          marginTop: '5px',
          backgroundColor: '#eee',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        About
      </button>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default UserActions;
