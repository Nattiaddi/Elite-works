import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      {/* 1. በሁሉም ገጽ ላይ የሚታየው Navbar */}
      <Navbar />

      {/* 2. ዋናው ኮንቴይነር - flex-col እና min-h-screen ፉተሩን ወደ ታች እንዲገፋው ይረዳሉ */}
      <div className="pt-20 bg-slate-950 min-h-screen flex flex-col">
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Gigs & Services */}
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/create-gig" element={<CreateGig />} />

            {/* Jobs & Bids */}
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            
            {/* User Specific */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-postings" element={<MyPostings />} />
            <Route path="/my-proposals" element={<MyApplications />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />   
          </Routes>
        </main>

        {/* 3. በሁሉም ገጽ ግርጌ የሚታየው Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;