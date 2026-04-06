import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// የገጾቹ Import
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import About from './pages/About';
import Contact from './pages/Contact'; // 👈 እዚህ ጋር ሴሚኮለን ተስተካክሏል

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 selection:bg-gold-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post-job" element={<PostJob />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;