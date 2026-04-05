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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-yellow-500">Elite Dashboard</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{userRole} Mode</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link to="/dashboard" className="block py-2.5 px-4 rounded hover:bg-gray-800 transition">Job Feed</Link>
          <Link to="/dashboard/post-job" className="block py-2.5 px-4 rounded hover:bg-gray-800 transition">Post a Job</Link>
          <Link to="/dashboard/notifications" className="block py-2.5 px-4 rounded hover:bg-gray-800 transition">Notifications</Link>
          <Link to="/dashboard/settings" className="block py-2.5 px-4 rounded hover:bg-gray-800 transition">Settings</Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left block py-2.5 px-4 rounded text-red-400 hover:bg-red-900/20 transition mt-10"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Welcome, {userRole}</span>
            <div className="h-8 w-8 rounded-full bg-yellow-500"></div>
          </div>
        </header>

        <main className="p-8">
          {/* ወሳኝ መስመር፡ የልጅ ገጾች (Routes) እዚህ ውስጥ ነው የሚታዩት */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;