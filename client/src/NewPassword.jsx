import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPassword() {
  // Form state
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Feedback state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // disable button during request

  const navigate = useNavigate();
  const API_URL = 'http://localhost:3001'; // backend URL

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    if (!username || !oldPassword || !newPassword) {
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
        credentials: 'include', // include cookies for session
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully! Redirecting to login...');
        setError('');
        // redirect to login after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.error || 'Failed to change password.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Network or server error:', err);
      setError('An error occurred. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newpassword-container">
      <h2>Change Password</h2>

      {/* Feedback messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Old Password */}
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}

export default NewPassword;