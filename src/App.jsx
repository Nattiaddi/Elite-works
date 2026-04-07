import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components & Pages Import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import HelpCenter from './pages/HelpCenter';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-gold-500/30 flex flex-col">
        {/* Navbar በሁሉም ገጾች ላይ ከላይ ሆኖ እንዲታይ */}
        <Navbar />
        
        {/* ዋናው ይዘት (Main Content) */}
        {/* min-h-[80vh] ማድረጋችን ይዘቱ ትንሽ ቢሆንም እንኳ Footer-ን ወደ ታች ይገፋዋል */}
        <main className="flex-grow pt-24 min-h-[80vh]"> 
          <Routes>
            {/* መግቢያ ገጽ */}
            <Route path="/" element={<LandingPage />} />
            
            {/* የማንነት ማረጋገጫ ገጾች */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* የተጠቃሚ ገጾች */}
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
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </main>

        {/* Footer በሁሉም ገጾች ግርጌ እንዲታይ */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;