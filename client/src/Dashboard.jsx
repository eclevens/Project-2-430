import React, { useState } from 'react';
import UserInfo from './UserInfo.jsx';
import Ad from './Ad.jsx';
import Premium from './Premium.jsx';

function Dashboard() {
  const [images, setImages] = useState([]);
  const [collageName, setCollageName] = useState('');
  const [currentCollageId, setCurrentCollageId] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const [premiumMode, setPremiumMode] = useState(false);
  const [premiumPopupVisible, setPremiumPopupVisible] = useState(false);

  const API_URL = 'http://localhost:3001';

  // add new img via url
  const handleAddImage = () => {
    if (!newImageUrl) {
      setMessage('Please enter a valid image URL.');
      return;
    }
    const newImage = {
      id: Date.now(),
      url: newImageUrl,
      x: 50,
      y: 50,
      scale: 1,
      zIndex: images.length,
    };
    setImages([...images, newImage]);
    setNewImageUrl('');
  };

  // img drag and drop
  const handleDrag = (id, e) => {
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, x: e.clientX - 50, y: e.clientY - 50 } : img
    );
    setImages(updatedImages);
  }; //little wonky rn

  // save collage, supports save new and update existing
  const handleSaveCollage = async (refreshCollages) => {
    if (!collageName) {
      setMessage('Please enter a collage name.'); //confirm name
      return;
    }
    try {
      const res = await fetch(`${API_URL}/maker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          _id: currentCollageId,
          collageName,
          images,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Collage saved successfully!');
        setCurrentCollageId(data.collage._id);
        refreshCollages?.();
      } else {
        setMessage(data.error || 'Failed to save collage.');
      }
    } catch (err) {
      console.error('Error saving collage:', err);
      setMessage('Error saving collage. Try again.');
    }
  };

  // load collage from the sidebar
  const handleLoadCollage = (loadedImages, loadedName, loadedId) => {
    const imagesWithId = loadedImages.map((img) => ({
      ...img,
      id: img.id || Date.now() + Math.random(),
    }));
    setImages(imagesWithId);
    setCollageName(loadedName);
    setCurrentCollageId(loadedId);
    setMessage('');
  };

  // toggle premium mode
  const handleTogglePremium = () => {
    setPremiumMode(!premiumMode);
    setPremiumPopupVisible(false); // hide popup after enabling/disabling
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <UserInfo
        onLoadCollage={handleLoadCollage}
        onSave={handleSaveCollage}
        onPremiumToggle={() => setPremiumPopupVisible(true)}
        premiumMode={premiumMode}
      />

      {/* Main content */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h2>Collage Maker</h2>

        {/* Collage name */}
        <div style={{ marginBottom: '10px' }}>
          <label>Collage Name: </label>
          <input
            type="text"
            value={collageName}
            onChange={(e) => setCollageName(e.target.value)}
          />
        </div>

        {/* Image URL input */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Enter image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <button onClick={handleAddImage}>Add Image</button>
          <button onClick={() => handleSaveCollage()} style={{ marginLeft: '10px' }}>
            Save Collage
          </button>
        </div>

        {/* Feedback */}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        {/* Canvas */}
        <div
          className="canvas"
          style={{
            position: 'relative',
            width: '800px',
            height: '600px',
            border: '1px solid #ccc',
            marginTop: '20px',
          }}
        >
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              draggable
              onDragEnd={(e) => handleDrag(img.id, e)}
              style={{
                position: 'absolute',
                left: img.x,
                top: img.y,
                transform: `scale(${img.scale})`,
                zIndex: img.zIndex,
                cursor: 'grab',
                width: '100px',
                height: '100px',
                objectFit: 'cover',
              }}
            />
          ))}
        </div>
      </div>

      {/* Ad banner */}
      <Ad premiumMode={premiumMode} />

      {/* Premium popup */}
      <Premium
        visible={premiumPopupVisible}
        onClose={() => setPremiumPopupVisible(false)}
        onTogglePremium={handleTogglePremium}
        premiumMode={premiumMode}
      />
    </div>
  );
}

export default Dashboard;
