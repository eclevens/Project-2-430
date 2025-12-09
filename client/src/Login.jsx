import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // backend URL here
  const API_URL = 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, pass: password }), // match backend field names
      });

      // parse JSON, handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error('Failed to parse JSON:', err);
        setError('Unexpected server response.');
        return;
      }

      if (response.ok) {
        // Login succeeded
        navigate('/dashboard'); //redirect to dashboard
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
