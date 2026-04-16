import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; 
import { 
  Home, Zap, Eye, Bookmark, Briefcase, PlusCircle, 
  ExternalLink, User, LogOut, ShieldCheck, CheckCircle 
} from 'lucide-react';

// JobCard Component - ለብቻው ቢሆን ይመረጣል
const JobCard = ({ job, showZap }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-gold-500/20 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        {showZap && (
          <span className="text-[8px] bg-gold-500 text-black px-2 py-0.5 rounded-full font-black uppercase italic mb-2 inline-block animate-pulse">
            Matched
          </span>
        )}
        <h4 className="text-xl font-black italic tracking-tighter uppercase">{job?.title}</h4>
      </div>
      <p className="text-gold-500 font-black italic">${job?.budget}</p>
    </div>
    <div className="flex justify-between items-center">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{job?.category}</p>
      <Link to={`/job/${job?.id}`} className="text-white hover:text-gold-500 transition-colors">
        <ExternalLink size={16}/>
      </Link>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [clientJobs, setClientJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }

        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(profileData);

        // Freelancer Data
        if (profileData?.user_role === 'freelancer') {
          const { data: rec } = await supabase.from('jobs')
            .select('*')
            .contains('required_skills', profileData.skills || [])
            .limit(4);
          setRecommendedJobs(rec || []);
          
          const { data: interactions } = await supabase.from('job_interactions')
            .select(`interaction_type, jobs (*)`)
            .eq('user_id', user.id);
          
          setViewedJobs(interactions?.filter(i => i.interaction_type === 'viewed').map(i => i.jobs).filter(Boolean) || []);
          setSavedJobs(interactions?.filter(i => i.interaction_type === 'saved').map(i => i.jobs).filter(Boolean) || []);
          
          const { data: props } = await supabase.from('proposals').select(`*, jobs(title, budget)`).eq('freelancer_id', user.id);
          setApplications(props || []);
        } 
        
        // Client Data
        if (profileData?.user_role === 'client') {
          const { data: myJobs } = await supabase.from('jobs').select('*').eq('client_id', user.id);
          setClientJobs(myJobs || []);
        }

        // Common: Escrow
        const { data: escrow } = await supabase.from('escrow')
          .select(`id, amount, status, jobs(title)`)
          .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`);
        setActiveProjects(escrow || []);

      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black italic text-gold-500 animate-pulse tracking-widest uppercase text-xs">
      Syncing Terminal...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Header */}
      <div className="pt-24 pb-16 px-6 border-b border-white/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              {profile?.user_role === 'client' ? 'Executive' : activeTab} <span className="text-gold-500">Suite</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-2">Elite Works Pro Terminal</p>
          </div>

          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 bg-white/5 p-2 pr-5 rounded-full border border-white/10 hover:border-gold-500/40 transition-all">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center font-black text-slate-950 uppercase">
                {profile?.full_name?.charAt(0) || "U"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black uppercase italic leading-none">{profile?.full_name}</p>
                <p className="text-[8px] text-gold-500 font-bold uppercase tracking-widest mt-1">${profile?.santim || 0}</p>
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl p-3 z-50 backdrop-blur-2xl">
                <Link to="/profile-update" className="flex items-center gap-3 px-4 py-3 hover:bg-gold-500 hover:text-slate-950 rounded-xl transition-all font-black uppercase italic text-[10px]"><User size={16} /> Profile</Link>
                <button onClick={() => { supabase.auth.signOut(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-black uppercase italic text-[10px]"><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 w-full flex-grow grid grid-cols-1 lg:grid-cols-4 gap-10 pb-20">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white/5 border border-white/5 p-4 rounded-[2.5rem] sticky top-32">
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('Home')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic transition-all ${activeTab === 'Home' ? 'bg-gold-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <Home size={16} /> Home
              </button>
              {profile?.user_role === 'freelancer' ? (
                <>
                  <button onClick={() => setActiveTab('Recommended')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic ${activeTab === 'Recommended' ? 'bg-gold-500 text-black' : 'text-slate-500'}`}><Zap size={16} /> Recommended</button>
                  <button onClick={() => setActiveTab('Tracker')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic ${activeTab === 'Tracker' ? 'bg-gold-500 text-black' : 'text-slate-500'}`}><Briefcase size={16} /> My Bids</button>
                </>
              ) : (
                <Link to="/post-job" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase italic bg-gold-500 text-black"><PlusCircle size={16} /> Post Job</Link>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-8">
          {activeTab === 'Home' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               {/* Welcome Section */}
               <div className="bg-slate-900/30 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Welcome back, {profile?.full_name?.split(' ')[0]}</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Status: Operational / Active Contracts: {activeProjects.length}</p>
               </div>

               {/* Conditional View for Client vs Freelancer */}
               {profile?.user_role === 'client' && (
                 <div className="grid grid-cols-1 gap-4">
                   <h3 className="text-xl font-black italic uppercase text-gold-500">My Job Listings</h3>
                   {clientJobs.map(job => (
                      <div key={job.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center group">
                        <h4 className="font-black italic uppercase">{job.title}</h4>
                        <Link to={`/job/${job.id}`} className="p-3 bg-white/5 rounded-full hover:text-gold-500"><ExternalLink size={16}/></Link>
                      </div>
                   ))}
                 </div>
               )}

               {/* Financials / Escrow Section */}
               <div className="space-y-4">
                  <h3 className="text-xl font-black italic uppercase text-gold-500">Financial Vault</h3>
                  {activeProjects.map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase">{p.jobs?.title}</p>
                        <h4 className="text-xl font-black italic tracking-tighter">${p.amount}</h4>
                      </div>
                      <span className="text-[9px] px-4 py-1.5 rounded-full border border-gold-500/20 text-gold-500 font-black uppercase bg-gold-500/5">{p.status}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Recommended' && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-black italic uppercase text-gold-500">AI Matched Projects</h3>
              {recommendedJobs.map(job => <JobCard key={job.id} job={job} showZap={true} />)}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;