import React, { useEffect, useState } from 'react';

function CollageList({ onLoadCollage }) {
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
      setMessage('Failed to fetch collages.');
    }
  };

  useEffect(() => {
    fetchCollages();
  }, []);

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
    <div>
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

export default CollageList;
