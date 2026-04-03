import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';
import { Check, X, ShieldAlert, Users, Briefcase, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, jobs: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // 1. መታወቂያ የላኩ ፍሪላንሰሮችን ማምጣት
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'pending');
    
    // 2. አጠቃላይ መረጃዎችን (Stats) ማምጣት
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });

    setPendingUsers(users || []);
    setStats({ users: userCount, jobs: jobCount, revenue: 0 });
    setLoading(false);
  };

  const handleVerify = async (userId, status) => {
    const { error } = await supabase
      .from('profiles')
      .update({ verification_status: status })
      .eq('id', userId);

    if (!error) {
      alert(`User status updated to ${status}`);
      fetchAdminData(); // ዝርዝሩን አድስ
    }
  };

  if (loading) return <div className="text-gold p-20 text-center font-black">ACCESSING ELITE CORE...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">ADMIN <span className="text-gold">CORE</span></h1>
          <p className="text-gray-500 mt-1">Platform management and verification center.</p>
        </div>
        <div className="flex gap-4">
          <StatCard icon={<Users className="text-gold" />} label="Total Members" value={stats.users} />
          <StatCard icon={<Briefcase className="text-gold" />} label="Active Jobs" value={stats.jobs} />
        </div>
      </header>

      {/* Verification Queue */}
      <section>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={20} /> Verification Queue
        </h2>

        <div className="grid gap-4">
          {pendingUsers.length === 0 ? (
            <div className="bg-obsidian-soft p-12 text-center rounded-3xl border border-white/5 text-gray-500 italic">
              No pending verifications at the moment.
            </div>
          ) : (
            pendingUsers.map((user) => (
              <div key={user.id} className="bg-obsidian-soft border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-bold text-gold">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{user.full_name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleVerify(user.id, 'verified')}
                    className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-black transition-all"
                  >
                    <Check size={20} />
                  </button>
                  <button 
                    onClick={() => handleVerify(user.id, 'rejected')}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-black transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-obsidian-soft p-4 px-6 rounded-2xl border border-white/5 flex items-center gap-4">
    {icon}
    <div>
      <p className="text-[10px] uppercase text-gray-500 font-black">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;