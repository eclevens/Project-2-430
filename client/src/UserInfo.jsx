import React, { useEffect, useState } from 'react';

function UserInfo({ onLoadCollage, onSave, onPremiumToggle, premiumMode }) {
  const [collages, setCollages] = useState([]);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:3001';

  // Fetch collages
  const fetchCollages = async () => {
    try {
      const res = await fetch(`${API_URL}/maker`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setCollages(data.collages);
      }
    } catch (err) {
      console.error('Error fetching collages:', err);
    }
  };

  useEffect(() => {
    fetchCollages();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      setMessage('Logout failed.');
    }
  };

  // Load collage
  const handleLoadCollage = (collage) => {
    if (onLoadCollage) {
      const imagesWithId = collage.images.map((img) => ({
        ...img,
        id: img.id || Date.now() + Math.random(),
      }));
      onLoadCollage(imagesWithId, collage.collageName, collage._id);
    }
  };

  // Delete collage
  const handleDeleteCollage = async (collageId) => {
    try {
      const res = await fetch(`${API_URL}/maker/${collageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Collage deleted!');
        fetchCollages();
      } else {
        setMessage(data.error || 'Failed to delete collage.');
      }
    } catch (err) {
      console.error('Error deleting collage:', err);
      setMessage('Error deleting collage.');
    }
  };

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

      {/* Logout + Premium buttons side by side */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <button onClick={handleLogout} style={{ flex: 1 }}>
          Log Out
        </button>
        {onPremiumToggle && (
          <button onClick={onPremiumToggle} style={{ flex: 1 }}>
            {premiumMode ? 'Disable Premium' : 'Enable Premium'}
          </button>
        )}
      </div>

      <h4>Your Collages</h4>
      {collages.length === 0 && <p>No collages saved yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {collages.map((collage) => (
          <li
            key={collage._id}
            style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}
          >
            <button
              onClick={() => handleLoadCollage(collage)}
              style={{
                flexGrow: 1,
                textAlign: 'left',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: '5px',
              }}
            >
              {collage.collageName}
            </button>
            <button
              onClick={() => handleDeleteCollage(collage._id)}
              style={{ marginLeft: '5px', cursor: 'pointer' }}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default UserInfo;