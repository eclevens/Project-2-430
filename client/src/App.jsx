import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import NewPassword from './NewPassword.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} /> {/* fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
