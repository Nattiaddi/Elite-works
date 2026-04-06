import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // የተጠቃሚውን ሁኔታ መከታተል
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();
        setRole(data?.user_role);
      }
    };

    getUserData();

    // በድንገት Login/Logout ቢደረግ ቼክ ለማድረግ
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session) setRole(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-gold-500 italic tracking-tighter hover:scale-105 transition-transform">
          ELITE<span className="text-white ml-1 font-light not-italic text-sm tracking-widest uppercase">Works</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors italic">Dashboard</Link>
              
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
              
              <Link to="/profile" className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center text-gold-500 font-black italic text-sm hover:bg-gold-500 hover:text-slate-950 transition-all">
                {user.email?.charAt(0).toUpperCase()}
              </Link>

              <button 
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-gold-500 transition-colors">Login</Link>
              <Link to="/signup" className="bg-gold-500 text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                Join Elite
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Icon (Placeholder) */}
        <div className="md:hidden text-gold-500 font-black italic">MENU</div>
      </div>
    </nav>
  );
};

export default Navbar;