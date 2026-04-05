import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// የገጾቹ Import
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob'; // 👈 እዚህ ጋር መኖሩን አረጋግጥ!

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 selection:bg-gold-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-job" element={<PostJob />} /> {/* እዚህ ጋር ስሙ በትክክል መጻፉን እይ */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;