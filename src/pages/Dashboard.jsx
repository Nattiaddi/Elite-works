import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { 
  Home, Zap, Eye, Bookmark, Briefcase, ChevronRight,
  TrendingUp, PlusCircle, Clock, ExternalLink, CheckCircle2, User, 
  Settings, ShieldCheck, LogOut, Headset, HelpCircle
} from 'lucide-react';
import Footer from './components/Footer'; // Footer.jsx መኖሩን አረጋግጥ

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Data States
  const [activeProjects, setActiveProjects] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [viewedJobs, setViewedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const navItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Recommended', label: 'Recommended Jobs', icon: Zap },
    { id: 'Viewed', label: 'Viewed Jobs', icon: Eye },
    { id: 'Saved', label: 'Saved Jobs', icon: Bookmark },
    { id: 'Tracker', label: 'Application Tracker', icon: Briefcase },
  ];

  const handleReleasePayment = async (escrowId, amount, freelancerId) => {
    const confirmRelease = window.confirm("Are you sure you want to release the payment?");
    if (confirmRelease) {
      try {
        await supabase.from('escrow').update({ status: 'completed' }).eq('id', escrowId);
        const { data: freelancerProfile } = await supabase.from('profiles').select('santim').eq('id', freelancerId).single();
        const newBalance = (freelancerProfile?.santim || 0) + amount;
        await supabase.from('profiles').update({ santim: newBalance }).eq('id', freelancerId);
        alert("Success! Funds transferred.");
        window.location.reload(); 
      } catch (err) {
        alert("Error: Failed to release funds.");
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
        const { data: rec } = await supabase.from('jobs').select('*').contains('required_skills', profileData.skills || []).limit(3);
        setRecommendedJobs(rec || []);
        const { data: interactions } = await supabase.from('job_interactions').select(`interaction_type, jobs (*)`).eq('user_id', user.id);
        setViewedJobs(interactions?.filter(i => i.interaction_type === 'viewed').map(i => i.jobs).filter(Boolean) || []);
        setSavedJobs(interactions?.filter(i => i.interaction_type === 'saved').map(i => i.jobs).filter(Boolean) || []);
        const { data: props } = await supabase.from('proposals').select(`*, jobs(title, budget)`).eq('freelancer_id', user.id);
        setApplications(props || []);
      }

      const { data: escrow } = await supabase.from('escrow').select(`id, amount, status, freelancer_id, jobs (title), profiles!escrow_freelancer_id_fkey (full_name)`).or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);
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

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">Syncing Terminal...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      
      {/* 1. HEADER */}
      <div className="relative pt-24 pb-16 px-6 border-b border-white/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
             <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
              {profile?.user_role === 'client' ? 'Executive' : activeTab} <span className="text-gold-500">Suite</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-2">Elite Works Pro Terminal</p>
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-white/5 p-2 pr-5 rounded-full border border-white/10 hover:border-gold-500/40 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center font-black text-slate-950">{profile?.full_name?.charAt(0) || "U"}</div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black uppercase italic leading-none">{profile?.full_name}</p>
                <p className="text-[8px] text-gold-500 font-bold uppercase tracking-widest mt-1">View Profile</p>
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl p-3 z-50 backdrop-blur-2xl">
                <div className="p-4 bg-white/5 rounded-2xl mb-2">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Vault Balance</p>
                  <p className="text-2xl font-black italic text-white">${profile?.santim || 0}</p>
                </div>
                <Link to="/profile-update" className="flex items-center gap-3 px-4 py-3 hover:bg-gold-500 hover:text-slate-950 rounded-xl transition-all font-black uppercase italic text-[10px]"><User size={16} /> Profile</Link>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-black uppercase italic text-[10px]"><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl sticky top-32">
              <nav className="space-y-2">
                {profile?.user_role === 'freelancer' ? (
                  navItems.map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-gold-500 text-slate-950' : 'text-slate-400 hover:bg-white/5'}`}>
                      <item.icon size={16} />
                      <span className="text-[11px] font-black uppercase tracking-widest italic">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="space-y-4">
                    <Link to="/post-job" className="flex items-center justify-center gap-2 bg-gold-500 text-slate-950 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all"><PlusCircle size={16} /> Post New Job</Link>
                    <button onClick={() => setActiveTab('Home')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'Home' ? 'bg-white/10 text-white' : 'text-slate-400'}`}><Home size={16} /> <span className="text-[11px] font-black uppercase italic tracking-widest">Client Dashboard</span></button>
                  </div>
                )}
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-3 space-y-8 pb-20">
            {activeTab === 'Home' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
                  <h3 className="text-2xl font-black italic mb-2 uppercase tracking-tighter">System Overview</h3>
                  <p className="text-slate-500 text-xs italic uppercase tracking-widest">Live Contracts: {activeProjects.length}</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {activeProjects.map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex justify-between items-center group hover:border-gold-500/20">
                      <div>
                        <p className="text-gold-500 text-[10px] font-black uppercase italic tracking-widest">{p.jobs?.title}</p>
                        <h4 className="text-xl font-black italic tracking-tighter">${p.amount}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] px-4 py-1.5 rounded-full uppercase font-black border ${p.status === 'completed' ? 'text-green-500' : 'text-gold-500'}`}>{p.status}</span>
                        {profile?.user_role === 'client' && p.status === 'pending' && (
                          <button onClick={() => handleReleasePayment(p.id, p.amount, p.freelancer_id)} className="bg-gold-500 text-slate-950 px-4 py-2 rounded-xl text-[9px] font-black uppercase italic hover:bg-white transition-all">Release Funds</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ... ሌሎች Tabs እዚህ ይቀጥላሉ (Recommended, Tracker ወዘተ) ... */}
          </main>
        </div>
      </div>

      {/* 3. FOOTER (ሁልጊዜ ከስር) */}
      <Footer />
    </div>
  );
};

export default Dashboard;