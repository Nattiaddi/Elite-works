import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ primary: 0, secondary: 0 });
  const [activeProjects, setActiveProjects] = useState([]);
  const [myJobs, setMyJobs] = useState([]); // ክላይንት የፖስት ያደረጋቸው ስራዎች
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
        // ክላይንት ከሆነ የፖስት ያደረጋቸውን ስራዎች ዝርዝር እናምጣ
        const { data: jobs, count } = await supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('client_id', user.id);
        setStats({ primary: count || 0, secondary: 0 });
        setMyJobs(jobs || []);
      } else {
        const { count } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);
        setStats({ primary: count || 0, secondary: 0 });
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
      <div className="text-gold-500 font-black italic animate-pulse tracking-widest uppercase">Loading Elite Dashboard...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-950 text-white">
      
      {/* 1. Header & SANTIM Balance */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Welcome, <span className="text-gold-500">{profile?.full_name || user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] italic">
            {profile?.user_role === 'client' ? 'Elite Client Terminal' : 'Professional Talent Suite'}
          </p>
        </div>

        {profile?.user_role === 'freelancer' && (
          <div className="bg-slate-900/60 border border-gold-500/20 p-6 rounded-[2.5rem] flex items-center gap-6 backdrop-blur-xl">
             <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center font-black text-slate-950">ቀ</div>
             <div>
                <p className="text-slate-500 text-[9px] uppercase font-bold italic">SANTIM Balance</p>
                <h2 className="text-2xl font-black italic">{profile?.santim || 0}</h2>
             </div>
             <Link to="/santim-shop" className="bg-gold-500/10 text-gold-500 border border-gold-500/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Get More</Link>
          </div>
        )}
      </div>

      {/* 2. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Quick Actions & My Jobs */}
        <div className="space-y-8">
          <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-[2.5rem]">
            <h3 className="text-gold-500 font-black italic mb-6 uppercase text-xs tracking-[0.3em]">Project Management</h3>
            
            {profile?.user_role === 'client' ? (
              <div className="space-y-4">
                <Link to="/post-job" className="block bg-gold-500 text-slate-950 p-4 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest">Post New Job</Link>
                
                {/* ክላይንቱ የፖስት ያደረጋቸው ስራዎች እዚህ ይታያሉ */}
                <div className="mt-8 space-y-3">
                  <p className="text-slate-500 text-[9px] font-black uppercase italic mb-4">My Open Positions</p>
                  {myJobs.map(job => (
                    <div key={job.id} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold italic truncate max-w-[120px]">{job.title}</span>
                      <Link 
                        to={`/review-proposals/${job.id}`}
                        className="text-gold-500 text-[9px] font-black uppercase tracking-widest border border-gold-500/30 px-3 py-1 rounded-lg hover:bg-gold-500 hover:text-slate-950 transition-all"
                      >
                        View Proposals
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/find-jobs" className="block bg-slate-800 p-4 rounded-2xl text-center font-black uppercase text-[10px] tracking-widest border border-slate-700">Find Work</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Escrow Status (Wider) */}
        <div className="lg:col-span-2">
           <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] p-8">
              <h3 className="text-white font-black italic uppercase text-xs tracking-[0.3em] mb-8">Active Escrow Contracts</h3>
              <div className="space-y-4">
                {activeProjects.map(project => (
                  <div key={project.id} className="bg-slate-800/20 border border-slate-800 p-6 rounded-[2rem] flex justify-between items-center">
                    <div>
                      <p className="text-gold-500 text-[9px] font-black uppercase mb-1">{project.jobs?.title}</p>
                      <p className="text-white font-bold italic">${project.amount}</p>
                    </div>
                    {profile?.user_role === 'client' && project.status === 'held' && (
                      <button onClick={() => handleReleasePayment(project.id)} className="bg-gold-500 text-slate-950 px-5 py-2 rounded-xl font-black uppercase text-[9px]">Release</button>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;