import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer'; 
import { 
  Zap, Eye, Bookmark, Briefcase, PlusCircle, Search, Filter,
  ExternalLink, User, LogOut, ShieldCheck, CheckCircle, Wallet,
  MessageSquare // ይሄ ተጨምሯል
} from 'lucide-react';

// JobCard Component
const JobCard = ({ job, showZap }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] group hover:border-gold-500/20 transition-all backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="text-left">
        {showZap && (
          <span className="text-[8px] bg-gold-500 text-black px-3 py-1 rounded-full font-black uppercase italic mb-2 inline-block animate-pulse">
            AI Matched
          </span>
        )}
        <h4 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-gold-500 transition-colors text-white">{job?.title}</h4>
      </div>
      <p className="text-gold-500 font-black italic text-lg">${job?.budget}</p>
    </div>
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{job?.category}</p>
      <Link to={`/job/${job?.id}`} className="p-2 bg-white/5 rounded-full text-white hover:bg-gold-500 hover:text-black transition-all">
        <ExternalLink size={14}/>
      </Link>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [clientJobs, setClientJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }

        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(profileData);

        if (profileData?.user_role === 'freelancer') {
          const { data: rec } = await supabase.from('jobs').select('*').limit(3);
          setRecommendedJobs(rec || []);
        } 
        
        if (profileData?.user_role === 'client') {
          const { data: myJobs } = await supabase.from('jobs').select('*').eq('client_id', user.id);
          setClientJobs(myJobs || []);
        }

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
      Initialising Elite Terminal...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="pt-24 pb-12 px-10">
          <div className="max-w-5xl text-left">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Control <span className="text-gold-500">Center</span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
                <span className="h-[1px] w-12 bg-gold-500/40"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  Operator: {profile?.full_name} / {profile?.user_role}
                </p>
            </div>
          </div>
        </header>

        <main className="px-10 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] backdrop-blur-md relative overflow-hidden group">
                    <div className="relative z-10 text-left">
                        <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Available Balance</p>
                        <h3 className="text-4xl font-black italic text-gold-500">${profile?.balance || 0}</h3>
                    </div>
                    <Wallet className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/5 -rotate-12 group-hover:text-gold-500/10 transition-colors" />
                </div>

                <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] backdrop-blur-md text-left">
                    <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">Active Contracts</p>
                    <h3 className="text-4xl font-black italic text-white">{activeProjects.length}</h3>
                </div>
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                  {profile?.user_role === 'client' ? 'Your Job Listings' : 'Recommended For You'}
                </h3>
                <Link to={profile?.user_role === 'client' ? '/manage-projects' : '/find-jobs'} className="text-[9px] font-black uppercase text-gold-500 hover:text-white transition-colors">
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.user_role === 'client' ? (
                  clientJobs.map(job => <JobCard key={job.id} job={job} />)
                ) : (
                  recommendedJobs.map(job => <JobCard key={job.id} job={job} showZap={true} />)
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
             <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 text-left">
                <h3 className="text-xs font-black uppercase italic text-gold-500 mb-6 flex items-center gap-2">
                    <ShieldCheck size={14} /> Escrow Protection
                </h3>
                <div className="space-y-4">
                  {activeProjects.length > 0 ? (
                    activeProjects.map(p => (
                      <div key={p.id} className="border-b border-white/5 pb-4 last:border-0">
                        <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{p.jobs?.title}</p>
                        <div className="flex justify-between items-end mt-1">
                          <span className="text-lg font-black italic text-white">${p.amount}</span>
                          <span className="text-[8px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-500 font-black uppercase">{p.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-600 italic">No funds currently in escrow.</p>
                  )}
                </div>
             </section>

             <div className="grid grid-cols-2 gap-3">
                <Link to="/wallet" className="bg-gold-500 text-slate-950 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white transition-all group">
                    <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase italic">Deposit</span>
                </Link>
                <Link to="/messages" className="bg-white/5 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <MessageSquare size={20} />
                    <span className="text-[9px] font-black uppercase italic">Chat</span>
                </Link>
             </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;