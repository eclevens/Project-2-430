import React, { useState } from 'react';

function Dashboard() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddImage = () => {
    if (!selectedFile) return;

    const newImage = {
      id: Date.now(),
      url: URL.createObjectURL(selectedFile),
      x: 50,
      y: 50,
      scale: 1,
      zIndex: images.length,
    };

    setImages([...images, newImage]);
    setSelectedFile(null);
  };

  const handleDrag = (id, e) => {
    const updatedImages = images.map((img) => {
      if (img.id === id) {
        return { ...img, x: e.clientX - 50, y: e.clientY - 50 };
      }
      return img;
    });
    setImages(updatedImages);
  };

  return (
    <div className="dashboard-container">
      <h2>Collage Maker</h2>

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleAddImage}>Add Image</button>
      </div>

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
  );
}

export default Dashboard;