import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabase';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages (እነዚህ ፋይሎች በ src/pages ውስጥ መኖራቸውን አረጋግጥ)
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import Connect from './pages/Connect';

// Features
import AuthPage from './features/auth/components/AuthPage';
import JobFeed from './features/jobs/components/JobFeed';
// ... ሌሎቹንም እንደ አስፈላጊነቱ እዚህ Import አድርግ

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('freelancer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (data) setUserRole(data.role);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen bg-black text-yellow-500 flex items-center justify-center italic">Elite Works Loading...</div>;

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/dashboard" />} />
        </Route>

        <Route path="/dashboard" element={session ? <DashboardLayout userRole={userRole} /> : <Navigate to="/login" />}>
          <Route index element={<JobFeed />} />
          {/* ሌሎች የዳሽቦርድ ገጾችን እዚህ ጨምር */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;