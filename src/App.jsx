import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// የገጾቹ Import
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* ሙሉ ዳራው (Background) ጥቁር እንዲሆን እና 
        ከገጽ ገጽ ስትቀያየር ምንም አይነት ነጭ ነገር እንዳይታይ እዚህ ጋር ክላስ ሰጥተነዋል
      */}
      <div className="min-h-screen bg-slate-950 selection:bg-gold-500/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;