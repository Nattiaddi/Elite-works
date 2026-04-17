import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  Briefcase, 
  ShieldAlert, 
  TrendingUp, 
  MoreHorizontal, 
  Check, 
  X,
  Lock,
  Search
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, revenue: 0, reports: 0 });
  const [users, setUsers] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      
      // 1. ጠቅላላ ስታቲስቲክስ (Stats)
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      
      setStats({
        users: userCount || 0,
        jobs: jobCount || 0,
        revenue: 45200, // ለምሳሌ ያህል
        reports: 3
      });

      // 2. ተጠቃሚዎችን ማምጣት
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setUsers(usersData || []);

      // 3. ያልጸደቁ ስራዎችን ማምጣት (Approval System ካለህ)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setPendingJobs(jobsData || []);

      setLoading(false);
    };

    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10 border-b border-white/5 bg-slate-900/20 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                Elite <span className="text-gold-500">Command</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
                System Administration & Infrastructure Control
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                <Search size={18} className="ml-4 text-slate-500" />
                <input type="text" placeholder="SEARCH SYSTEM..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest p-3 w-64" />
            </div>
          </div>
        </header>

        <main className="p-10 space-y-12">
          
          {/* --- TOP STATS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Members" value={stats.users} icon={<Users />} color="text-blue-400" />
            <StatCard label="Active Projects" value={stats.jobs} icon={<Briefcase />} color="text-gold-500" />
            <StatCard label="System Revenue" value={`$${stats.revenue}`} icon={<TrendingUp />} color="text-emerald-500" />
            <StatCard label="Security Alerts" value={stats.reports} icon={<ShieldAlert />} color="text-red-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* --- RECENT USERS SECTION --- */}
            <section className="bg-white/5 border border-white/5 rounded-[3rem] p-8">
              <div className="flex justify-between items-center mb-8 px-4">
                <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-3">
                  <Users size={18} className="text-gold-500" /> New Entities
                </h3>
                <button className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors">Manage All</button>
              </div>
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-gold-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-slate-950 font-black italic">
                        {user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase italic">{user.full_name}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{user.user_role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:text-gold-500 transition-colors"><Lock size={14}/></button>
                      <button className="p-2 hover:text-red-500 transition-colors"><X size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- JOB MONITORING SECTION --- */}
            <section className="bg-white/5 border border-white/5 rounded-[3rem] p-8">
              <div className="flex justify-between items-center mb-8 px-4">
                <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-3">
                  <Briefcase size={18} className="text-gold-500" /> Content Queue
                </h3>
                <button className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors">Review Queue</button>
              </div>
              <div className="space-y-4">
                {pendingJobs.map(job => (
                  <div key={job.id} className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div>
                      <h4 className="text-[11px] font-black uppercase italic text-white group-hover:text-gold-500 transition-colors">{job.title}</h4>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">By: {job.profiles?.full_name} • ${job.budget}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg hover:bg-emerald-500 hover:text-white transition-all">
                        <Check size={14} />
                      </button>
                      <button className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-gold-500/20 transition-all">
    <div className={`absolute -right-4 -bottom-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      {React.cloneElement(icon, { size: 80 })}
    </div>
    <div className={`${color} mb-4`}>{React.cloneElement(icon, { size: 24 })}</div>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic mb-1">{label}</p>
    <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
  </div>
);

export default AdminPanel;