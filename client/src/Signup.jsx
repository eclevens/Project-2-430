import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:3001'; // backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end validation
    if (!username || !password || !confirmPassword) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // include cookies for session
        body: JSON.stringify({
          username,
          pass: password,   // match backend field names
          pass2: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Signup successful! Redirecting to dashboard...');
        // redirect after short delay
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.error || 'Signup failed.');
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
    <div className="signup-container">
      <h2>Signup</h2>

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

        {/* Password */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
}

export default Signup;