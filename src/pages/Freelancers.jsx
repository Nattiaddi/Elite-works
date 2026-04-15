import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, Star, ShieldCheck, Mail } from 'lucide-react';

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFreelancers = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_role', 'freelancer');
      setFreelancers(data || []);
    };
    fetchFreelancers();
  }, []);

  // Filter Logic
  const filtered = freelancers.filter(f => 
    f.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Expert <span className="text-gold-500">Talent</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Global Elite Network</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by skill or name..." 
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-gold-500/50 italic text-sm transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(f => (
            <div key={f.id} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-gold-500/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gold-500/10 rounded-2xl border border-gold-500/20 flex items-center justify-center text-gold-500 font-black text-2xl italic">
                  {f.full_name?.charAt(0)}
                </div>
                <div className="bg-gold-500 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase italic">Top Rated</div>
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">{f.full_name}</h3>
              <p className="text-slate-400 text-xs line-clamp-2 mb-6 italic">{f.bio || "Elite professional specialized in high-end solutions."}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {f.skills?.slice(0, 3).map(s => (
                  <span key={s} className="bg-white/5 text-[9px] px-3 py-1 rounded-lg border border-white/5 uppercase font-black italic">{s}</span>
                ))}
              </div>

              <button className="w-full bg-white/5 hover:bg-gold-500 hover:text-slate-950 p-4 rounded-xl font-black uppercase italic text-[10px] tracking-widest transition-all">
                View Portfolio
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Freelancers;