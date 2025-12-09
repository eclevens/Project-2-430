import React from 'react';

function Premium({ visible, onClose, onTogglePremium, premiumMode }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        <h2>Premium Access</h2>
        <p>Purchase premium today to unlock ad-free collaging!</p>
        <button
          onClick={onTogglePremium}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
        >
          {premiumMode ? 'Disable Premium' : 'Enable Premium'}
        </button>
      </div>
    </div>
  );
}

export default Premium;