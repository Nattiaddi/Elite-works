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
import Contact from './pages/Contact'; 
import FindJobs from './pages/FindJobs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyPostings from './pages/MyPostings';
import MyApplications from './pages/MyApplications';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 selection:bg-gold-500/30">
        {/* Navbar በሁሉም ገጾች ላይ እንዲታይ ከRoutes በላይ ይቀመጣል */}
        <Navbar />
        
        {/* Navbar በገጾቹ ላይ እንዳይደራረብ padding-top (pt-24) ተጨምሯል */}
        <div className="pt-24"> 
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/my-postings" element={<MyPostings />} />
            <Route path="/my-proposals" element={<MyApplications />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;