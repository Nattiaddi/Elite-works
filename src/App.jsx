import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Gigs from './pages/Gigs';
import CreateGig from './pages/CreateGig';
import PostJob from './pages/PostJob';
import FindJobs from './pages/FindJobs';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyPostings from './pages/MyPostings';
import MyApplications from './pages/MyApplications';
import About from './pages/About';
import HelpCenter from './pages/HelpCenter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Verification from './pages/Verification';
import ForgotPassword from './pages/ForgotPassword';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import AdminDashboard from './pages/AdminDashboard';
import LiveChat from './components/LiveChat';

// Stripe Public Key - እዚህ ጋር የራስህን ቁልፍ አስገባ
const stripePromise = loadStripe('pk_test_YourActualKeyHere'); 

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        {/* በሁሉም ገጽ ላይ የሚታየው Navbar */}
        <Navbar />
        
        {/* የላይቭ ቻት ኮምፖነንት */}
        <LiveChat />

        <div className="pt-20 bg-slate-950 min-h-screen flex flex-col">
          <main className="flex-grow">
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Gigs & Services */}
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/create-gig" element={<CreateGig />} />

              {/* Jobs & Bids */}
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/post-job" element={<PostJob />} />
              
              {/* User Specific & Finance */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/my-postings" element={<MyPostings />} />
              <Route path="/my-proposals" element={<MyApplications />} />
              
              {/* Legal & Contact */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} /> 
              <Route path="/admin-command-center" element={<AdminDashboard />} />  
            </Routes>
          </main>

          {/* በሁሉም ገጽ ግርጌ የሚታየው Footer */}
          <Footer />
        </div>
      </Router>
    </Elements>
  );
}

export default App;