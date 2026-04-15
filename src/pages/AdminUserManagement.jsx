import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, UserCheck, UserMinus, Search, Mail, Shield, MoreVertical } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, freelancers: 0, clients: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setUsers(data);
      // Stats ማጠቃለል
      const freelancers = data.filter(u => u.role === 'freelancer').length;
      const clients = data.filter(u => u.role === 'client').length;
      setStats({ total: data.length, freelancers, clients });
    }
    setLoading(false);
  };

  // ተጠቃሚን ለማገድ ወይም ለማንቃት (Toggle Status)
  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const confirm = window.confirm(`Are you sure you want to ${newStatus} this user?`);
    
    if (confirm) {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
      
      if (!error) fetchUsers();
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'text-white' },
          { label: 'Freelancers', value: stats.freelancers, icon: Shield, color: 'text-gold-500' },
          { label: 'Clients', value: stats.clients, icon: UserCheck, color: 'text-blue-400' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] backdrop-blur-xl">
            <item.icon className={`w-5 h-5 ${item.color} mb-4`} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">{item.label}</p>
            <h3 className="text-3xl font-black italic text-white mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* User Table Section */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-500" /> User Directory
          </h3>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME OR EMAIL..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[10px] font-bold text-white outline-none focus:border-gold-500/50 transition-all italic"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                <th className="px-8 py-5">User Info</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-gold-500 italic">
                        {user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black italic text-white uppercase">{user.full_name}</p>
                        <p className="text-[9px] text-slate-500 font-bold lowercase">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${user.role === 'freelancer' ? 'border-gold-500/20 text-gold-500' : 'border-blue-500/20 text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className="text-[9px] font-black uppercase italic text-slate-400">{user.status || 'active'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => toggleUserStatus(user.id, user.status || 'active')}
                      className={`text-[9px] font-black uppercase tracking-widest italic px-4 py-2 rounded-lg transition-all ${user.status === 'suspended' ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;