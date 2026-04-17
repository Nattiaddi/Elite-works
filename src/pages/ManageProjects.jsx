import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import { 
  Briefcase, Send, Clock, CheckCircle, 
  XCircle, Eye, User, DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageProjects = () => {
  const [profile, setProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]); // ለ Client
  const [myProposals, setMyProposals] = useState([]); // ለ Freelancer
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(userData);

      if (userData.user_role === 'client') {
        // ደንበኛው የለጠፋቸው ስራዎች ከፕሮፖዛል ብዛት ጋር
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*, proposals(count)')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
        setMyJobs(jobs || []);
      } else {
        // ፍሪላንሰሩ የላካቸው ፕሮፖዛሎች ከስራው ዝርዝር ጋር
        const { data: proposals } = await supabase
          .from('proposals')
          .select('*, jobs(title, budget, category)')
          .eq('freelancer_id', user.id)
          .order('created_at', { ascending: false });
        setMyProposals(proposals || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            Manage <span className="text-gold-500">Projects</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
            {profile?.user_role === 'client' ? 'Track your job postings and applicants' : 'Monitor your submitted proposals'}
          </p>
        </header>

        <main className="px-10 max-w-6xl w-full">
          {loading ? (
            <div className="py-20 text-center font-black italic text-gold-500 animate-pulse uppercase text-[10px] tracking-widest">
              Syncing with Elite Server...
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* --- CLIENT VIEW: MY POSTED JOBS --- */}
              {profile?.user_role === 'client' && (
                <div className="space-y-4">
                  {myJobs.length > 0 ? myJobs.map((job) => (
                    <div key={job.id} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex flex-wrap items-center justify-between group hover:border-gold-500/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black italic uppercase tracking-tight group-hover:text-gold-500 transition-colors">{job.title}</h3>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[8px] font-black uppercase text-slate-500 italic">Budget: ${job.budget}</span>
                            <span className="text-[8px] font-black uppercase text-gold-500 italic">{job.proposals[0]?.count || 0} Proposals</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/job/${job.id}`} className="px-6 py-3 bg-white/5 hover:bg-white hover:text-slate-950 rounded-xl font-black uppercase italic text-[9px] tracking-widest transition-all">
                        View Applicants
                      </Link>
                    </div>
                  )) : <EmptyState message="You haven't posted any jobs yet." />}
                </div>
              )}

              {/* --- FREELANCER VIEW: MY PROPOSALS --- */}
              {profile?.user_role === 'freelancer' && (
                <div className="space-y-4">
                  {myProposals.length > 0 ? myProposals.map((prop) => (
                    <div key={prop.id} className="bg-white/5 border border-white/5 p-8 rounded-[3rem] flex flex-wrap items-center justify-between relative overflow-hidden group">
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                          <Send size={24} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mb-1">{prop.jobs?.category}</p>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter">{prop.jobs?.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white italic"><DollarSign size={12}/> {prop.bid_amount}</span>
                            <StatusBadge status={prop.status} />
                          </div>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                         <p className="text-[8px] font-black uppercase text-slate-600 italic mb-2">Submitted on {new Date(prop.created_at).toLocaleDateString()}</p>
                         <Link to={`/job/${prop.job_id}`} className="text-gold-500 font-black uppercase italic text-[9px] tracking-widest hover:text-white transition-colors">View Project →</Link>
                      </div>
                    </div>
                  )) : <EmptyState message="You haven't sent any proposals yet." />}
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ንዑስ ኮምፖነንቶች (Sub-components)
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg border italic ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
    <p className="text-slate-600 italic font-black tracking-widest uppercase text-[10px]">{message}</p>
  </div>
);

export default ManageProjects;