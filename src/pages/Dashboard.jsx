import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ primary: 0, secondary: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Profile መረጃ ማምጣት
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // እንደ Role-ኡ የተለያየ ዳታ መቁጠር
      if (profileData?.user_role === 'client') {
        const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('client_id', user.id);
        setStats({ primary: count || 0, secondary: 0 }); // secondary ለወደፊት Payments ሊሆን ይችላል
      } else {
        const { count } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('freelancer_id', user.id);
        setStats({ primary: count || 0, secondary: 0 });
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse">Loading Elite Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
          Welcome back, <span className="text-gold-500">{profile?.full_name || user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-slate-500 font-medium italic">Here is what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">
            {profile?.user_role === 'client' ? 'Total Jobs Posted' : 'Total Proposals Sent'}
          </p>
          <p className="text-5xl font-black text-gold-500 italic leading-none">{stats.primary}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Earnings / Spent</p>
          <p className="text-5xl font-black text-white italic leading-none">$0</p>
        </div>

        <div className="bg-gold-500 p-8 rounded-[2rem] shadow-2xl shadow-gold-500/10 flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-4 italic">Account Status</p>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-black text-slate-950 italic uppercase tracking-tighter">Elite Plus</span>
            <Link to="/profile" className="text-[9px] font-black uppercase bg-slate-950 text-white px-3 py-1 rounded-full">Manage</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[2.5rem]">
          <h3 className="text-white font-black italic mb-6 uppercase text-sm tracking-widest">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {profile?.user_role === 'client' ? (
              <>
                <Link to="/post-job" className="bg-slate-800/40 hover:bg-gold-500 hover:text-slate-950 p-6 rounded-2xl transition-all group">
                  <p className="font-black italic uppercase text-xs">Post New Job</p>
                </Link>
                <Link to="/my-postings" className="bg-slate-800/40 hover:bg-gold-500 hover:text-slate-950 p-6 rounded-2xl transition-all">
                  <p className="font-black italic uppercase text-xs">View Applicants</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/find-jobs" className="bg-slate-800/40 hover:bg-gold-500 hover:text-slate-950 p-6 rounded-2xl transition-all">
                  <p className="font-black italic uppercase text-xs">Browse Jobs</p>
                </Link>
                <Link to="/my-proposals" className="bg-slate-800/40 hover:bg-gold-500 hover:text-slate-950 p-6 rounded-2xl transition-all">
                  <p className="font-black italic uppercase text-xs">Track Bids</p>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Placeholder for Recent Activity */}
        <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[2.5rem] flex items-center justify-center border-dashed">
           <p className="text-slate-600 font-bold italic uppercase text-[10px] tracking-widest">No recent notifications</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;