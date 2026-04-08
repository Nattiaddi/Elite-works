import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Bell, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // 'user_role' የሚለውን ኮለም ከ profiles ቴብል ማምጣት
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setRole(data?.role);
        fetchNotifications(user.id);
      }
    };
    getUserData();

    // የአውቴንቲኬሽን ለውጦችን መከታተል
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session) {
        setRole(null);
        setHasUnread(false);
      }
    });

    // ሪል-ታይም ኖቲፊኬሽን ለመከታተል (Insert ሲደረግ)
    const channel = supabase.channel('notifs').on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'notifications' }, 
      () => { setHasUnread(true); }
    ).subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async (userId) => {
    const { data } = await supabase.from('notifications').select('id').eq('user_id', userId).eq('is_read', false);
    if (data?.length > 0) setHasUnread(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-gold-500 italic tracking-tighter uppercase group">
          Elite<span className="text-white ml-0.5 group-hover:text-gold-500 transition-colors">Works</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/gigs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Marketplace</Link>
          
          {user && (
            <>
              {role === 'client' ? (
                <Link to="/post-job" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic border-l border-slate-800 pl-8">Post Job</Link>
              ) : (
                <Link to="/find-jobs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic border-l border-slate-800 pl-8">Find Work</Link>
              )}
            </>
          )}
        </div>

        {/* User Interaction Area */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              {/* Message Icon */}
              <Link to="/messages" className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/50 transition-all group">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
                {/* ለጊዜው Message ካለ የሚበራ ነጥብ */}
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
              </Link>

              {/* Notifications Icon */}
              <div className="relative p-2 cursor-pointer rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/50 transition-all group">
                <Bell className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </div>

              {/* User Profile Dropdown Placeholder */}
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
                <Link to="/dashboard" className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-gold-500" title="Dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                <Link to="/profile" className="w-8 h-8 bg-gold-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-xs italic hover:scale-105 transition-transform">
                  {user.email?.charAt(0).toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-slate-400 hover:text-red-500" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/20">Join Elite</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;