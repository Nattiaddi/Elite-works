import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  CreditCard, 
  UserCircle, 
  Settings, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import { supabase } from '../../config/supabase';

const Sidebar = ({ userRole = 'freelancer' }) => {
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const menuItems = userRole === 'client' ? [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Post a Job', path: '/post-job' },
    { icon: <Briefcase size={20} />, label: 'My Jobs', path: '/my-jobs' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/billing' },
  ] : [
    { icon: <LayoutDashboard size={20} />, label: 'Feed', path: '/dashboard' },
    { icon: <Briefcase size={20} />, label: 'My Proposals', path: '/proposals' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <CreditCard size={20} />, label: 'Earnings', path: '/earnings' },
    { icon: <UserCircle size={20} />, label: 'My Profile', path: '/profile/me' },
  ];

  return (
    <aside className="w-64 h-screen bg-obsidian-soft border-r border-white/5 flex flex-col sticky top-0">
      {/* Brand Logo */}
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tighter">
          <span className="text-gold">ELITE</span> <span className="text-white">WORKS</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-gold transition-all group"
          >
            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a href="/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-all">
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </a>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500/80 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;