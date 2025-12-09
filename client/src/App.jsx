import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import NewPassword from './NewPassword.jsx';
import Dashboard from './Dashboard.jsx';
import NotFound from './404.jsx'; // import new 404 page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} /> {/* fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
