import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ primary: 0, secondary: 0 });
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ክፍያ የመልቀቂያ (Release Payment) Logic ---
  const handleReleasePayment = async (escrowId) => {
    const confirmRelease = window.confirm("Are you sure? This will release 90% of the funds to the freelancer.");
    if (!confirmRelease) return;

    try {
      const { data, error } = await supabase.rpc('release_escrow_payment', { 
        escrow_row_id: escrowId 
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        alert("Success! Payment released and Elite commission secured.");
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // 1. Profile መረጃ ማምጣት
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // 2. ስታቲስቲክስ መቁጠር
      if (profileData?.user_role === 'client') {
        const { count } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id);
        setStats({ primary: count || 0, secondary: 0 });
      } else {
        const { count } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);
        setStats({ primary: count || 0, secondary: 0 });
      }

      // 3. የኤስክሮው መረጃዎችን ማምጣት (እዚህ ጋር ተጨምሯል)
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow')
        .select(`
          id,
          amount,
          status,
          jobs (title),
          profiles!escrow_freelancer_id_fkey (full_name)
        `)
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!escrowError) setActiveProjects(escrowData || []);
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-gold-500 font-black italic animate-pulse tracking-widest uppercase">
        Loading Elite Dashboard...
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950">
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black italic text-white mb-2 uppercase tracking-tighter">
          Welcome, <span className="text-gold-500">{profile?.full_name || user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] italic">
          {profile?.user_role === 'client' ? 'Elite Client Terminal' : 'Professional Talent Suite'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">
            {profile?.user_role === 'client' ? 'Active Projects' : 'Total Proposals'}
          </p>
          <p className="text-6xl font-black text-gold-500 italic leading-none">{stats.primary}</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 italic">Treasury Status</p>
          <p className="text-6xl font-black text-white italic leading-none">$0</p>
        </div>

        <div className="bg-gold-500 p-8 rounded-[2.5rem] shadow-2xl shadow-gold-500/10 flex flex-col justify-between group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-4 italic">Membership</p>
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-slate-950 italic uppercase tracking-tighter">Elite Plus</span>
            <Link to="/profile" className="text-[9px] font-black uppercase bg-slate-950 text-white px-4 py-2 rounded-full">Manage</Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[2.5rem]">
            <h3 className="text-white font-black italic mb-6 uppercase text-xs tracking-[0.3em]">Quick Terminal</h3>
            <div className="flex flex-col gap-4">
              {profile?.user_role === 'client' ? (
                <>
                  <Link to="/post-job" className="bg-slate-800/40 border border-slate-700/50 hover:border-gold-500 p-6 rounded-2xl transition-all">
                    <p className="font-black italic uppercase text-[10px] text-gold-500 mb-1">Initiate</p>
                    <p className="font-black italic uppercase text-sm text-white">Post New Job</p>
                  </Link>
                  <Link to="/wallet" className="bg-slate-800/40 border border-slate-700/50 hover:border-gold-500 p-6 rounded-2xl transition-all">
                    <p className="font-black italic uppercase text-[10px] text-gold-500 mb-1">Treasury</p>
                    <p className="font-black italic uppercase text-sm text-white">Deposit Funds</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/find-jobs" className="bg-slate-800/40 border border-slate-700/50 hover:border-gold-500 p-6 rounded-2xl transition-all">
                    <p className="font-black italic uppercase text-[10px] text-gold-500 mb-1">Explore</p>
                    <p className="font-black italic uppercase text-sm text-white">Browse Markets</p>
                  </Link>
                  <Link to="/my-proposals" className="bg-slate-800/40 border border-slate-700/50 hover:border-gold-500 p-6 rounded-2xl transition-all">
                    <p className="font-black italic uppercase text-[10px] text-gold-500 mb-1">Operations</p>
                    <p className="font-black italic uppercase text-sm text-white">Active Bids</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Escrow Contracts (Wider) */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-slate-800/50 flex justify-between items-center">
              <h3 className="text-white font-black italic uppercase text-xs tracking-[0.3em]">Active Escrow Contracts</h3>
              <span className="bg-gold-500/10 text-gold-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic animate-pulse">Live</span>
            </div>

            <div className="p-8">
              {activeProjects.length > 0 ? (
                <div className="space-y-4">
                  {activeProjects.map((project) => (
                    <div key={project.id} className="bg-slate-800/20 border border-slate-800/50 hover:border-gold-500/30 p-6 rounded-[2rem] transition-all flex flex-wrap justify-between items-center gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-gold-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Project Contract</p>
                        <h4 className="text-white font-bold text-base italic truncate max-w-[250px]">{project.jobs?.title || "Contract ID: " + project.id.slice(0,8)}</h4>
                        <p className="text-slate-500 text-[9px] uppercase font-bold">Partner: {project.profiles?.full_name || "Elite User"}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Assets</p>
                          <p className="text-xl font-black text-white italic">${project.amount}</p>
                        </div>

                        {profile?.user_role === 'client' && project.status === 'held' ? (
                          <button 
                            onClick={() => handleReleasePayment(project.id)}
                            className="bg-gold-500 text-slate-950 px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/10"
                          >
                            Release
                          </button>
                        ) : (
                          <div className={`px-4 py-2 rounded-lg border ${project.status === 'held' ? 'border-slate-800 bg-slate-900/50' : 'border-gold-500/20 bg-gold-500/5'}`}>
                            <span className={`font-black uppercase text-[9px] italic tracking-widest ${project.status === 'held' ? 'text-slate-500' : 'text-gold-500'}`}>
                              {project.status === 'held' ? 'Locked' : 'Released'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed border-slate-800 rounded-[2rem]">
                  <p className="text-slate-700 font-black italic uppercase text-[10px] tracking-[0.4em]">Zero Active Signals Found</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;