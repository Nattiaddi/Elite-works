import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabase';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Connect from './pages/Connect.jsx';

// Features (እነዚህ ፋይሎች በቦታቸው መኖራቸውን አረጋግጥ)
import AuthPage from './features/auth/components/AuthPage';
import JobFeed from './features/jobs/components/JobFeed';
import PostJob from './features/jobs/components/PostJob';
import JobDetails from './features/jobs/components/JobDetails';
import PublicProfile from './features/profiles/components/PublicProfile';
import AdminDashboard from './features/admin/components/AdminDashboard';
import ProfileSettings from './features/profiles/components/ProfileSettings';
import NotificationHistory from './features/notifications/components/NotificationHistory';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('freelancer'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (data) setUserRole(data.role);
    } catch (err) {
      console.error("Error fetching role:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-[#d4af37] font-bold tracking-widest uppercase italic">
        Elite Works Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* --- Public Routes --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/dashboard" />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
        </Route>

        {/* --- Admin Route --- */}
        <Route 
          path="/admin" 
          element={session && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
        />

        {/* --- Protected Dashboard Routes --- */}
        <Route 
          path="/dashboard" 
          element={session ? <DashboardLayout userRole={userRole} /> : <Navigate to="/login" />}
        >
          <Route index element={<JobFeed />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="notifications" element={<NotificationHistory />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;