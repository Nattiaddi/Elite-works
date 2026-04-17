import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Bell, LogOut, LayoutDashboard, Wallet } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // ፕሮፋይል እና ሮል መረጃን በአንድ ላይ እናምጣ
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
        fetchNotifications(user.id);
      }
    };

    getUserData();

    // የአውቴንቲኬሽን ለውጦችን ለመከታተል
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session) {
        setProfile(null);
        setNotifications([]);
        setUnreadCount(0);
      } else {
        getUserData(); // ተጠቃሚው ሲገባ ዳታውን እንደገና አድስ
      }
    });

    // Real-time Notifications (ለአዳዲስ ኖቲፊኬሽኖች)
    const channel = supabase.channel('notifs').on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'notifications' }, 
      (payload) => { 
        setNotifications(prev => [payload.new, ...prev].slice(0, 5));
        setUnreadCount(prev => prev + 1);
      }
    ).subscribe();

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
      .order('created_at', { ascending: false })
      .limit(5);

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.is_read).length || 0);
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    setUnreadCount(0);
  };

  const handleNotifClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs) markAsRead();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 1. Logo */}
        <Link to="/" className="text-xl font-black italic tracking-tighter text-white uppercase group">
          Elite<span className="text-gold-500 group-hover:text-white transition-colors">Works</span>
        </Link>

        {/* 2. Desktop Navigation Links (Role Based) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/marketplace" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Marketplace</Link>
          
          {user && profile?.user_role === 'freelancer' && (
            <Link to="/find-jobs" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic border-l border-slate-800 pl-8">
              Find Work
            </Link>
          )}

          {user && profile?.user_role === 'client' && (
            <Link to="/post-job" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic border-l border-slate-800 pl-8">
              Post Job
            </Link>
          )}
        </div>

        {/* 3. Interaction Area (Balance, Notifs, Profile) */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              {/* Balance Display (ለተጠቃሚው ብቻ የሚታይ) */}
              <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 group hover:border-gold-500/30 transition-all">
                <Wallet className="w-3 h-3 text-gold-500" />
                <span className="text-sm font-black italic text-white">
                  ${profile?.balance || 0}
                </span>
              </div>

              {/* Messages */}
              <Link to="/messages" className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/50 transition-all group">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button onClick={handleNotifClick} className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-gold-500/50 transition-all group">
                  <Bell className="w-4 h-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse border border-slate-900"></span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gold-500 mb-4 border-b border-white/5 pb-2">Recent Updates</h4>
                    <div className="space-y-3">
                      {notifications.length === 0 ? (
                        <p className="text-[10px] text-slate-600 italic py-4 text-center font-bold">No new notifications.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                            <p className="text-[11px] text-white font-medium italic">{n.message}</p>
                            <span className="text-[8px] text-slate-500 block mt-1 uppercase font-black">{new Date(n.created_at).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile & Control Group */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
                <Link to="/dashboard" className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-gold-500" title="Dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                <Link to="/profile" className="w-8 h-8 bg-gold-500 text-slate-950 rounded-xl flex items-center justify-center font-black text-xs italic hover:scale-105 transition-transform" title="Profile">
                  {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-slate-400 hover:text-red-500" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/20 active:scale-95">
                Join Elite
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;