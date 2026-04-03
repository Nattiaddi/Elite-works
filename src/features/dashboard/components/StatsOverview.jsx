import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 400, jobs: 24 },
  { name: 'Feb', revenue: 800, jobs: 30 },
  { name: 'Mar', revenue: 1200, jobs: 45 },
  { name: 'Apr', revenue: 900, jobs: 38 },
  { name: 'May', revenue: 1700, jobs: 52 },
];

const StatsOverview = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign className="text-gold" />} label="Total Earnings" value="$4,250.00" trend="+12.5%" />
        <StatCard icon={<Briefcase className="text-gold" />} label="Active Projects" value="12" trend="+2 new" />
        <StatCard icon={<Users className="text-gold" />} label="Profile Views" value="1,284" trend="+18%" />
        <StatCard icon={<TrendingUp className="text-gold" />} label="Success Rate" value="98%" trend="Elite" />
      </div>

      {/* 2. Revenue Chart Section */}
      <div className="bg-obsidian-soft p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
            <p className="text-gray-500 text-sm">Monthly revenue and job completion growth</p>
          </div>
          <select className="bg-obsidian border border-white/10 text-gray-400 text-xs p-2 rounded-lg outline-none focus:border-gold">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#D4AF37' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="bg-obsidian-soft p-6 rounded-3xl border border-white/5 hover:border-gold/20 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gold/10 rounded-2xl group-hover:bg-gold/20 transition-colors">{icon}</div>
      <span className="text-[10px] font-black text-gold bg-gold/10 px-2 py-1 rounded-md">{trend}</span>
    </div>
    <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">{label}</p>
    <p className="text-2xl font-black text-white mt-1">{value}</p>
  </div>
);

export default StatsOverview;