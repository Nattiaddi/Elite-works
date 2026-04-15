import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatPopup from './components/ChatPopup';

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
import JobDetail from './pages/JobDetail'; 
import Messages from './pages/Messages'; 
import PostProposal from './pages/PostProposal';
import SANTIMShop from './pages/SANTIMShop';
import ReviewProposals from './pages/ReviewProposals';
import JobDetails from './pages/JobDetails';
import Freelancers from './pages/Freelancers';
import ProfileUpdate from './pages/ProfileUpdate';

// Stripe Public Key
const stripePromise = loadStripe('pk_test_YourActualKeyHere'); 

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <div className="bg-slate-950 min-h-screen flex flex-col">
          {/* 1. NAVBAR (ከላይ ሁልጊዜ የሚታይ) */}
          <Navbar />
          
          {/* 2. MAIN CONTENT (Routes) */}
          <main className="flex-grow">
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/profile-update" element={<ProfileUpdate />} />
              <Route path="/freelancers" element={<Freelancers />} />
              
              {/* Gigs & Services */}
              <Route path="/gigs" element={<Gigs />} />
              <Route path="/create-gig" element={<CreateGig />} />

              {/* Jobs & Bids */}
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/job/:id" element={<JobDetail />} /> 
              <Route path="/apply/:jobId" element={<PostProposal />} />
              <Route path="/santim-shop" element={<SANTIMShop />} />
              <Route path="/review-proposals/:jobId" element={<ReviewProposals />} />
              
              {/* User Specific & Finance */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/my-postings" element={<MyPostings />} />
              <Route path="/my-proposals" element={<MyApplications />} />
              
              {/* Communication & Admin */}
              <Route path="/messages" element={<Messages />} />
              <Route path="/admin-command-center" element={<AdminDashboard />} /> 

              {/* Legal & Contact */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>

          {/* 3. FOOTER (በሁሉም ገጾች ስር የሚታይ) */}
          <Footer />

          {/* Global Chat Popup */}
          <ChatPopup 
            receiverId="SUPPORT_ADMIN_ID" 
            receiverName="Elite Support" 
          />
        </div>
      </Router>
    </Elements>
  );
}

export default App;