import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Feedback state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:3001'; // backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // include
        body: JSON.stringify({ username, pass: password }), // match backend field names
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        setError('Unexpected server response.');
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        // Login succeeded, redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {/* Feedback message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;