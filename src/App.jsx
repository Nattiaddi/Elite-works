import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* የዋናው ገጽ (Home) Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* የLogin ገጽ Route */}
        <Route path="/login" element={<Login />} />
        
        {/* የSignup ገጽ Route */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;