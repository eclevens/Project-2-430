import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:3001'; // hardcoded for dev

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }

    if (oldPassword === newPassword) {
      setError('New password must be different from old password.');
      setSuccess('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/newpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        setError('Server returned unexpected response.');
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        setSuccess('Password changed successfully! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Network or server error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Change Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: '8px 12px' }}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default NewPassword;
