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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20 bg-slate-950 min-h-screen">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;