import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { 
  Home, Zap, Eye, Bookmark, Briefcase, ChevronRight,
  TrendingUp, PlusCircle, Clock, ExternalLink, CheckCircle2, User, 
  Settings, ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [loading, setLoading] = useState(true);

  // Data States
  const [activeProjects, setActiveProjects] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [viewedJobs, setViewedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);

  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Recommended', label: 'Recommended Jobs', icon: Zap },
    { id: 'Viewed', label: 'Viewed Jobs', icon: Eye },
    { id: 'Saved', label: 'Saved Jobs', icon: Bookmark },
    { id: 'Tracker', label: 'Application Tracker', icon: Briefcase },
  ];

  const handleReleasePayment = async (escrowId, amount, freelancerId) => {
    const confirmRelease = window.confirm("Are you sure you want to release the payment? This action cannot be undone.");
    
    if (confirmRelease) {
      try {
        // 1. Escrow status አዘምን
        const { error: escrowError } = await supabase.from('escrow').update({ status: 'completed' }).eq('id', escrowId);
        if (escrowError) throw escrowError;
        
        // 2. የፍሪላንሰሩን የድሮ ባላንስ አምጣ
        const { data: freelancerProfile } = await supabase
          .from('profiles')
          .select('santim')
          .eq('id', freelancerId)
          .single();

        // 3. አዲሱን ባላንስ አስላና ጨምርለት
        const newBalance = (freelancerProfile?.santim || 0) + amount;
        await supabase.from('profiles').update({ santim: newBalance }).eq('id', freelancerId);
        
        alert("Success! Funds have been transferred to the professional's vault.");
        window.location.reload(); 
      } catch (err) {
        console.error(err);
        alert("Encryption Error: Failed to release funds.");
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);

      if (profileData?.user_role === 'freelancer') {
        const { data: rec } = await supabase.from('jobs').select('*')
          .contains('required_skills', profileData.skills || []).limit(3);
        setRecommendedJobs(rec || []);

        const { data: interactions } = await supabase.from('job_interactions')
          .select(`interaction_type, jobs (*)`).eq('user_id', user.id);
        
        setViewedJobs(interactions?.filter(i => i.interaction_type === 'viewed').map(i => i.jobs).filter(Boolean) || []);
        setSavedJobs(interactions?.filter(i => i.interaction_type === 'saved').map(i => i.jobs).filter(Boolean) || []);

        const { data: props } = await supabase.from('proposals')
          .select(`*, jobs(title, budget)`).eq('freelancer_id', user.id);
        setApplications(props || []);
      }

      if (profileData?.user_role === 'client') {
        const { data: jobs } = await supabase.from('jobs').select('*').eq('client_id', user.id);
        setMyJobs(jobs || []);
      }

      // Escrow Data - freelancer_id እዚህ ጋር መጠራት አለበት
      const { data: escrow } = await supabase.from('escrow')
        .select(`id, amount, status, freelancer_id, jobs (title), profiles!escrow_freelancer_id_fkey (full_name)`)
        .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);
      setActiveProjects(escrow || []);
      
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const JobCard = ({ job, showZap = false }) => (
    <div className="group bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-gold-500/30 transition-all backdrop-blur-md relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-black italic uppercase tracking-tighter group-hover:text-gold-500 transition-colors flex items-center gap-2">
            {job.title} {showZap && <Zap size={14} className="text-gold-500 fill-gold-500" />}
          </h4>
          <p className="text-slate-500 text-[10px] mt-1 italic uppercase tracking-widest">${job.budget} • {job.category || 'Elite Project'}</p>
        </div>
        <Link to={`/jobs/${job.id}`} className="shrink-0 bg-white/5 hover:bg-gold-500 hover:text-slate-950 p-3 rounded-xl transition-all">
          <ExternalLink size={16} />
        </Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">
      Syncing Terminal...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 font-sans">
      
      {/* HEADER */}
      <div className="relative pt-32 pb-16 px-6 text-center border-b border-white/5 bg-slate-900/20">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 relative z-10">
          {profile?.user_role === 'client' ? 'Executive' : activeTab} <span className="text-gold-500">Suite</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] italic relative z-10">
          <span className="text-gold-500/50">PRO TERMINAL</span>
          <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse"></span>
          <Link to="/profile-update" className="hover:text-gold-500 transition-colors flex items-center gap-2">
            {profile?.full_name || "ELITE USER"}
            <Settings size={12} className="text-gold-500/50" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl sticky top-32">
              <nav className="space-y-2">
                {profile?.user_role === 'freelancer' ? (
                  navItems.map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-gold-500 text-slate-950 shadow-lg shadow-gold-500/20' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                      <item.icon size={16} />
                      <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <>
                    <Link to="/post-job" className="flex items-center justify-center gap-2 bg-gold-500 text-slate-950 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-[1.02] transition-all mb-4">
                      <PlusCircle size={16} /> Post New Job
                    </Link>
                    <button onClick={() => setActiveTab('Home')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'Home' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
                      <Home size={16} /> <span className="text-[11px] font-black uppercase italic tracking-widest">Dashboard</span>
                    </button>
                  </>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5">
                  <Link to="/profile-update" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-gold-500/10 hover:text-gold-500 transition-all group border border-transparent hover:border-gold-500/20">
                    <User size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest italic">Settings</span>
                  </Link>
                </div>
              </nav>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="bg-gold-500/5 p-4 rounded-2xl border border-gold-500/10 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-gold-500" />
                    <span className="text-xl font-black italic tracking-tighter text-white group-hover:text-gold-500 transition-colors">
                      ${profile?.santim || 0}
                    </span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600 italic">Vault</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-3 space-y-8">
            
            {activeTab === 'Home' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
                  <h3 className="text-2xl font-black italic mb-2 uppercase tracking-tighter">System Overview</h3>
                  <p className="text-slate-500 text-xs italic uppercase tracking-widest">Live Contracts: {activeProjects.length}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeProjects.map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-gold-500/20 transition-all">
                      <div>
                        <p className="text-gold-500 text-[10px] font-black uppercase italic tracking-widest">{p.jobs?.title}</p>
                        <h4 className="text-xl font-black italic tracking-tighter">${p.amount}</h4>
                        <p className="text-[8px] text-slate-600 uppercase font-black italic mt-1 flex items-center gap-1">
                           <ShieldCheck size={10} className="text-gold-500/50" />
                           {profile?.user_role === 'client' ? `Professional: ${p.profiles?.full_name}` : `Client Funds Secured`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] px-4 py-1.5 rounded-full uppercase font-black border border-white/5 ${p.status === 'completed' ? 'text-green-500' : 'text-gold-500'}`}>
                          {p.status}
                        </span>
                        
                        {profile?.user_role === 'client' && p.status === 'pending' && (
                          <button 
                            onClick={() => handleReleasePayment(p.id, p.amount, p.freelancer_id)}
                            className="bg-gold-500 text-slate-950 px-4 py-2 rounded-xl text-[9px] font-black uppercase italic hover:bg-white hover:scale-105 transition-all"
                          >
                            Release Funds
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {activeProjects.length === 0 && (
                    <p className="text-center py-10 text-slate-600 italic text-xs uppercase tracking-widest">No secure contracts found</p>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs remain the same logic-wise but inside this container */}
            {activeTab === 'Recommended' && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
                {recommendedJobs.length > 0 ? recommendedJobs.map(j => <JobCard key={j.id} job={j} showZap={true} />) : <p className="text-center py-20 text-slate-600 italic text-xs uppercase tracking-widest">No skill matches found</p>}
              </div>
            )}

            {activeTab === 'Viewed' && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
                {viewedJobs.length > 0 ? viewedJobs.map(j => <JobCard key={j.id} job={j} />) : <p className="text-center py-20 text-slate-600 italic text-xs uppercase tracking-widest">No history found</p>}
              </div>
            )}

            {activeTab === 'Saved' && (
              <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
                {savedJobs.length > 0 ? savedJobs.map(j => <JobCard key={j.id} job={j} />) : <p className="text-center py-20 text-slate-600 italic text-xs uppercase tracking-widest">No saved jobs</p>}
              </div>
            )}

            {activeTab === 'Tracker' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                {applications.length > 0 ? applications.map(app => (
                  <div key={app.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-gold-500/20 transition-all">
                    <div>
                      <h4 className="font-black italic uppercase tracking-tighter group-hover:text-gold-500 transition-colors">{app.jobs?.title}</h4>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1 italic">Bid: ${app.bid_amount || app.jobs?.budget}</p>
                    </div>
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase border ${app.status === 'accepted' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-gold-500/30 text-gold-500 bg-gold-500/5'}`}>
                      {app.status}
                    </span>
                  </div>
                )) : <p className="text-center py-20 text-slate-600 italic text-xs uppercase tracking-widest">No applications sent</p>}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;