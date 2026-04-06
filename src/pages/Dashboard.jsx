import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // ከ Profiles table ሚናውን (Role) ማምጣት
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    getProfile();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black italic animate-pulse tracking-widest">LOADING ELITE PANEL...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 md:p-16 rounded-[3rem] mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:bg-gold-500/20 transition-all"></div>
          
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            Welcome Back, <span className="text-gold-500">{profile?.full_name?.split(' ')[0] || 'Elite'}!</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl italic">
            {profile?.user_role === 'client' 
              ? "Ready to hire the best talent for your next big project?" 
              : "Explore premium opportunities and grow your freelance career."}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {profile?.user_role === 'client' ? (
              <>
                <Link to="/post-job" className="bg-gold-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl shadow-gold-500/20">
                  Post a New Job
                </Link>
                <Link to="/my-postings" className="bg-slate-800/50 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all border border-slate-700">
                  Manage Jobs
                </Link>
              </>
            ) : (
              <>
                <Link to="/find-jobs" className="bg-gold-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl shadow-gold-500/20">
                  Browse Opportunities
                </Link>
                <Link to="/my-proposals" className="bg-slate-800/50 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all border border-slate-700">
                  My Applications
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Account Type</p>
              <p className="text-2xl font-black text-gold-500 capitalize">{profile?.user_role}</p>
           </div>
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Status</p>
              <p className="text-2xl font-black text-white">Verified</p>
           </div>
           <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Profile Completion</p>
              <p className="text-2xl font-black text-white">85%</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;