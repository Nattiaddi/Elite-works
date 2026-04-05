import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const DashboardLayout = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold text-yellow-500 mb-8">Elite Works</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block hover:text-yellow-500">Job Feed</Link>
          <Link to="/dashboard/post-job" className="block hover:text-yellow-500">Post Job</Link>
          <button onClick={handleLogout} className="text-red-400 mt-10">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;