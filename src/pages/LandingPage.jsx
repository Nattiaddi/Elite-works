import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components & Pages Import
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import FindJobs from './pages/FindJobs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyPostings from './pages/MyPostings';
import MyApplications from './pages/MyApplications';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 selection:bg-gold-500/30">
        {/* Navbar በሁሉም ገጾች ላይ ከላይ ሆኖ እንዲታይ */}
        <Navbar />
        
        {/* ይዘቱ ከNavbar በታች እንዲጀምር pt-24 (Padding Top) ሰጥተነዋል */}
        <div className="pt-24"> 
          <Routes>
            {/* ለሁሉም እንግዳ የሚታይ መግቢያ */}
            <Route path="/" element={<LandingPage />} />
            
            {/* የማንነት ማረጋገጫ ገጾች */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* የገቡ ተጠቃሚዎች ገጽ (Dashboard) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* የስራ ገጾች */}
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/my-postings" element={<MyPostings />} />
            <Route path="/my-proposals" element={<MyApplications />} />
            
            {/* ሌሎች መረጃዎች */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;