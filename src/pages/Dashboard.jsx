import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReleasePayment = async (escrowId) => {
    const confirmRelease = window.confirm("Are you sure? This will release 90% of the funds to the freelancer.");
    if (!confirmRelease) return;
    try {
      const { data, error } = await supabase.rpc('release_escrow_payment', { 
        escrow_row_id: escrowId 
      });
      if (error) { alert("Error: " + error.message); } 
      else { alert("Success! Payment released."); window.location.reload(); }
    } catch (err) { console.error("Payment Error:", err); }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);

      if (profileData?.user_role === 'client') {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('client_id', user.id);
        setMyJobs(jobs || []);
      }

      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow')
        .select(`id, amount, status, jobs (title), profiles!escrow_freelancer_id_fkey (full_name)`)
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!escrowError) setActiveProjects(escrowData || []);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-xs">Loading Elite Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* 1. PREMIUM HEADER SECTION */}
      <div className="relative pt-32 pb-20 overflow-hidden px-6">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-20">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
            <span className="text-white drop-shadow-2xl">WELCOME,</span> <br />
            <span className="text-gold-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]">
              {profile?.full_name?.split(' ')[0] || "ELITE"} {profile?.full_name?.split(' ')[1] || "USER"}
            </span>
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <span className="h-[1px] w-12 bg-gold-500/50"></span>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] italic">
              {profile?.user_role === 'client' ? 'Elite Client Terminal' : 'Professional Talent Suite'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        
        {/* 2. STATS & WALLET INFO */}
        {profile?.user_role === 'freelancer' && (
          <div className="mb-12 inline-flex items-center gap-6 bg-slate-900/40 border border-white/5 p-4 pr-8 rounded-[2rem] backdrop-blur-xl">
             <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-gold-500/20">ቀ</div>
             <div>
                <p className="text-slate-500 text-[9px] uppercase font-black italic tracking-widest">SANTIM Balance</p>
                <h2 className="text-3xl font-black italic leading-none mt-1">{profile?.santim || 0}</h2>
             </div>
             <Link to="/santim-shop" className="ml-4 bg-white/5 hover:bg-gold-500 hover:text-slate-950 border border-white/10 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                Refill
             </Link>
          </div>
        )}

        {/* 3. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Quick Actions & My Jobs */}
          <div className="space-y-8">
            <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
              <h3 className="text-gold-500 font-black italic mb-8 uppercase text-[10px] tracking-[0.3em]">Project Management</h3>
              
              {profile?.user_role === 'client' ? (
                <div className="space-y-6">
                  <Link to="/post-job" className="group block bg-gold-500 text-slate-950 p-5 rounded-2xl text-center font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/10">
                    Post New Job
                  </Link>
                  
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-slate-500 text-[9px] font-black uppercase italic">My Open Positions</p>
                    {myJobs.length === 0 ? (
                      <p className="text-[9px] text-slate-700 italic font-bold uppercase">No active job posts.</p>
                    ) : (
                      myJobs.map(job => (
                        <div key={job.id} className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-gold-500/30 transition-all">
                          <span className="text-[11px] font-black italic truncate max-w-[120px] uppercase tracking-tighter">{job.title}</span>
                          <Link 
                            to={`/review-proposals/${job.id}`}
                            className="text-gold-500 text-[9px] font-black uppercase tracking-widest border border-gold-500/30 px-3 py-2 rounded-xl hover:bg-gold-500 hover:text-slate-950 transition-all"
                          >
                            Proposals
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link to="/find-jobs" className="block bg-slate-800/50 hover:bg-slate-800 p-5 rounded-2xl text-center font-black uppercase text-[11px] tracking-widest border border-white/5 transition-all">
                    Find Work
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: Escrow Status */}
          <div className="lg:col-span-2">
             <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
                <h3 className="text-white font-black italic uppercase text-[10px] tracking-[0.3em] mb-10">Active Escrow Contracts</h3>
                <div className="space-y-4">
                  {activeProjects.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
                      <p className="text-slate-600 text-[10px] font-black uppercase italic tracking-widest">No active contracts found.</p>
                    </div>
                  ) : (
                    activeProjects.map(project => (
                      <div key={project.id} className="bg-slate-950/50 border border-white/5 p-6 rounded-[2rem] flex justify-between items-center hover:border-gold-500/20 transition-all">
                        <div>
                          <p className="text-gold-500 text-[9px] font-black uppercase mb-1 tracking-widest italic">{project.jobs?.title}</p>
                          <h4 className="text-2xl font-black italic tracking-tighter">${project.amount}</h4>
                          <span className="text-[8px] bg-white/5 text-slate-500 px-2 py-1 rounded-md uppercase font-black mt-2 inline-block">Status: {project.status}</span>
                        </div>
                        {profile?.user_role === 'client' && project.status === 'held' && (
                          <button 
                            onClick={() => handleReleasePayment(project.id)} 
                            className="bg-gold-500 text-slate-950 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gold-500/10 hover:scale-105 transition-all"
                          >
                            Release
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;