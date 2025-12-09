import React from 'react';

function Ad({ premiumMode }) {
  if (premiumMode) return null; // hide ad if premium enabled

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: '#f1f1f1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '1px solid #ccc',
        zIndex: 1000,
      }}
    >
      <img
        src="/img/ad.png"
        alt="Advertisement"
        style={{ maxHeight: '80px', objectFit: 'contain' }}
      />
    </div>
  );
}

export default Ad;