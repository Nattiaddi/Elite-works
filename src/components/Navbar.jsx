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
        // የጥቅም ሚና (Role) ማምጣት
        const { data } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();
        setRole(data?.user_role);

        // ኖቲፊኬሽኖችን መጀመሪያ ማምጣት
        fetchNotifications(user.id);
      }
    };

    getUserData();

    // የ Auth ለውጦችን መከታተል
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (!session) {
        setRole(null);
        setNotifications([]);
        setHasUnread(false);
      } else {
        getUserData(); // ሚናውን እና ኖቲፊኬሽኑን ለማደስ
      }
    });

    // Realtime Notifications Listener
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setHasUnread(true);
        }
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async (userId) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (data?.length > 0) {
      setHasUnread(true);
      setNotifications(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter hover:scale-105 transition-transform">
          ELITE<span className="text-white ml-1 font-light not-italic text-sm tracking-widest uppercase">Works</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">About</Link>

          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative cursor-pointer group">
                <span className="text-xl">🔔</span>
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-slate-950 animate-bounce"></span>
                )}
                
                {/* Notification Dropdown */}
                <div className="absolute right-0 mt-4 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 hidden group-hover:block shadow-2xl backdrop-blur-xl">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest italic border-b border-slate-800 pb-2">Recent Alerts</p>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {notifications.length === 0 ? (
                      <p className="text-[10px] text-slate-600 italic font-bold py-2">NO NEW NOTIFICATIONS</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                          <p className="text-[11px] text-white font-medium italic leading-relaxed">{n.message}</p>
                          <p className="text-[8px] text-slate-600 font-black mt-1 uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Role Links */}
              {role === 'client' ? (
                <>
                  <Link to="/post-job" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Post Job</Link>
                  <Link to="/my-postings" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Manage Jobs</Link>
                </>
              ) : (
                <>
                  <Link to="/find-jobs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Find Jobs</Link>
                  <Link to="/my-proposals" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">My Bids</Link>
                </>
              )}
              
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Dashboard</Link>

              {/* Profile Avatar */}
              <Link to="/profile" className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center text-gold-500 font-black italic text-sm hover:bg-gold-500 hover:text-slate-950 transition-all">
                {user.email?.charAt(0).toUpperCase()}
              </Link>

              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors italic"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors">Login</Link>
              <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/20">
                Join Elite
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden text-gold-500 font-black italic cursor-pointer text-xs tracking-widest">MENU</div>
      </div>
    </nav>
  );
};

export default Navbar;