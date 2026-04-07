import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('user_role').eq('id', user.id).single();
        setRole(data?.user_role);
        fetchNotifications(user.id);
      }
    };
    getUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session) setRole(null);
    });

    const channel = supabase.channel('notifs').on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'notifications' }, 
      (payload) => { setNotifications(prev => [payload.new, ...prev]); setHasUnread(true); }
    ).subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async (userId) => {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).eq('is_read', false);
    if (data?.length > 0) { setHasUnread(true); setNotifications(data); }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter uppercase">
          Elite<span className="text-white ml-1 font-light not-italic text-sm tracking-widest">Works</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          <Link to="/gigs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Gigs</Link>
          <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">About</Link>

          {user ? (
            <>
              {/* Notification */}
              <div className="relative cursor-pointer group">
                <span className="text-xl">🔔</span>
                {hasUnread && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-slate-950"></span>}
              </div>

              {/* Role Based Links */}
              {role === 'client' ? (
                <>
                  <Link to="/post-job" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Post Job</Link>
                  <Link to="/my-postings" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">My Posts</Link>
                </>
              ) : (
                <>
                  <Link to="/create-gig" className="text-[10px] font-black uppercase tracking-widest text-gold-500 border border-gold-500/20 px-4 py-2 rounded-lg hover:bg-gold-500 hover:text-slate-950 transition-all italic">+ Post Service</Link>
                  <Link to="/find-jobs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Find Jobs</Link>
                </>
              )}

              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Dashboard</Link>
              
              <Link to="/profile" className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center text-gold-500 font-black italic text-sm hover:bg-gold-500 hover:text-slate-950 transition-all">
                {user.email?.charAt(0).toUpperCase()}
              </Link>

              <button onClick={handleLogout} className="text-[10px] font-black uppercase text-red-500/70 hover:text-red-500 transition-colors italic">Logout</button>
            </>
          ) : (
            <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/20">Join Elite</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;