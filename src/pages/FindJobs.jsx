import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar መኖሩን አረጋግጥ
import { categories as categoryData } from '../constants/categories';
import { Search, Filter, Wallet, ArrowRight, Database } from 'lucide-react';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching jobs:', error);
      else {
        setJobs(data);
        setFilteredJobs(data);
      }
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let result = jobs;
    if (activeCategory !== 'All') {
      result = result.filter(job => job.category === activeCategory);
    }
    if (activeSubCategory !== 'All') {
      result = result.filter(job => job.sub_category === activeSubCategory);
    }
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredJobs(result);
  }, [searchTerm, activeCategory, activeSubCategory, jobs]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* 1. Sidebar - ቋሚ የግራ ዝርዝር */}
      <Sidebar />

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Premium Header Section */}
        <header className="relative pt-32 pb-16 px-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-5xl relative z-10">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
              EXECUTIVE <br />
              <span className="text-gold-500">MARKETPLACE</span>
            </h1>
            <div className="flex items-center gap-4">
                <span className="h-[1px] w-12 bg-gold-500/40"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  Curated Elite Opportunities
                </p>
            </div>
          </div>
        </header>

        <main className="px-10 pb-20">
          
          {/* Interaction Bar: Wallet & Search */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white/5 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
            
            {/* Wallet Summary */}
            <div className="flex items-center gap-4 pl-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">ቀ</div>
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-black italic tracking-widest leading-none">Your Credits</p>
                <h2 className="text-2xl font-black italic text-white mt-1">${profile?.balance || 0}</h2>
              </div>
              <Link to="/deposit" className="ml-4 p-2 bg-white/5 hover:bg-gold-500 hover:text-slate-950 rounded-xl transition-all border border-white/10 group">
                <PlusCircle size={18} className="group-active:scale-90" />
              </Link>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search elite projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filter - አሁን ይበልጥ ንጹህ ሆኗል */}
            <aside className="w-full lg:w-64 shrink-0 space-y-8">
              <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] sticky top-32">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Categories</h3>
                  {(activeCategory !== 'All') && (
                    <button onClick={() => { setActiveCategory('All'); setActiveSubCategory('All'); }} className="text-gold-500 text-[8px] font-black uppercase hover:underline">Reset</button>
                  )}
                </div>

                <div className="space-y-4">
                  {categoryData.map((cat) => (
                    <div key={cat.id}>
                      <button 
                        onClick={() => { setActiveCategory(cat.name); setActiveSubCategory('All'); }}
                        className={`flex items-center gap-3 w-full text-left font-black uppercase tracking-widest text-[9px] py-2 transition-all ${activeCategory === cat.name ? 'text-gold-500 translate-x-2' : 'text-slate-500 hover:text-white'}`}
                      >
                        <cat.icon size={14} />
                        {cat.name}
                      </button>
                      {activeCategory === cat.name && (
                        <div className="mt-2 ml-6 space-y-2 animate-in slide-in-from-left-2 duration-300">
                          {cat.subCategories.map((sub) => (
                            <button 
                              key={sub}
                              onClick={() => setActiveSubCategory(sub)}
                              className={`block text-[8px] font-bold uppercase tracking-tighter transition-all ${activeSubCategory === sub ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                              • {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Jobs Grid */}
            <div className="flex-grow">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-[10px]">
                  <Database size={32} />
                  Accessing Elite Database...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredJobs.map((job) => (
                    <Link to={`/job/${job.id}`} key={job.id} className="group bg-white/5 border border-white/5 p-8 rounded-[3rem] hover:border-gold-500/30 transition-all duration-500 relative overflow-hidden">
                      {/* Hover Glow Effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl group-hover:bg-gold-500/10 transition-colors"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gold-500 bg-gold-500/5 border border-gold-500/10 px-3 py-1.5 rounded-full italic">
                          {job.category}
                        </span>
                        <div className="text-right">
                          <p className="text-slate-500 text-[8px] font-black uppercase tracking-tighter leading-none mb-1">Budget</p>
                          <span className="text-white font-black italic text-xl">${job.budget}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-gold-500 transition-colors italic leading-tight uppercase tracking-tighter">
                        {job.title}
                      </h3>
                      
                      <p className="text-slate-400 text-xs line-clamp-2 mb-8 italic leading-relaxed font-medium">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Posted On</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase italic">{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-slate-950 transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="col-span-full text-center py-32 border border-dashed border-white/5 rounded-[4rem] bg-white/[0.02]">
                      <p className="text-slate-600 italic font-black tracking-widest uppercase text-[10px]">
                        No elite opportunities found. Try adjusting your filters.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindJobs;