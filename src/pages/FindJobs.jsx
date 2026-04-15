import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { categories as categoryData } from '../constants/categories';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [profile, setProfile] = useState(null); // ፕሮፋይል ዳታ ለመያዝ
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');

  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. የገቡትን ተጠቃሚ ዳታ እናምጣ (ለዋሌቱ)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }

      // 2. ስራዎቹን እናምጣ
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

  // Search & Filter Logic
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
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* 1. PREMIUM CENTERED HEADER (ከዳሽቦርዱ ጋር እንዲመሳሰል) */}
      <div className="relative pt-32 pb-20 overflow-hidden px-6 text-center">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-20">
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] mb-6">
            FIND YOUR NEXT <br />
            <span className="text-gold-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">MASTERPIECE</span>
          </h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] italic flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-gold-500/30"></span>
            Premium opportunities for professionals
            <span className="h-[1px] w-8 bg-gold-500/30"></span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        
        {/* 2. WALLET & SEARCH BAR SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          {/* Wallet - አሁን እዚህ ይታያል */}
          <div className="inline-flex items-center gap-4 bg-slate-900/40 border border-white/5 p-3 pr-6 rounded-2xl backdrop-blur-xl">
             <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-black text-slate-950 text-lg">ቀ</div>
             <div className="text-left">
                <p className="text-slate-500 text-[8px] uppercase font-black italic tracking-widest">Balance</p>
                <h2 className="text-xl font-black italic leading-none mt-0.5 text-gold-500">${profile?.balance || profile?.santim || 0}</h2>
             </div>
             <Link to="/deposit" className="ml-2 bg-white/5 hover:bg-gold-500 hover:text-slate-950 border border-white/10 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">
                Add Funds
             </Link>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search jobs (e.g. AI, Design)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic text-sm shadow-2xl shadow-black/50"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] sticky top-32 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black uppercase tracking-tighter text-sm italic">Filters</h3>
                {(activeCategory !== 'All' || activeSubCategory !== 'All') && (
                  <button 
                    onClick={() => { setActiveCategory('All'); setActiveSubCategory('All'); }}
                    className="text-gold-500 text-[9px] font-black uppercase hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {categoryData.map((cat) => (
                  <div key={cat.id}>
                    <button 
                      onClick={() => { setActiveCategory(cat.name); setActiveSubCategory('All'); }}
                      className={`flex items-center gap-3 w-full text-left font-black uppercase tracking-widest text-[10px] mb-3 transition-all ${activeCategory === cat.name ? 'text-gold-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <cat.icon size={14} className={activeCategory === cat.name ? 'text-gold-500' : 'text-slate-600'} />
                      {cat.name}
                    </button>
                    {activeCategory === cat.name && (
                      <ul className="pl-6 space-y-2 mb-4 border-l border-gold-500/20 ml-1.5 animate-in slide-in-from-left-2">
                        {cat.subCategories.map((sub) => (
                          <li key={sub}>
                            <button 
                              onClick={() => setActiveSubCategory(sub)}
                              className={`text-[9px] block w-full text-left font-bold transition-all ${activeSubCategory === sub ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Jobs Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="py-20 text-center text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-xs">
                Accessing Elite Database...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="group bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-gold-500/30 transition-all duration-500 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[8px] font-black uppercase tracking-widest text-gold-500 bg-gold-500/5 border border-gold-500/10 px-3 py-1.5 rounded-lg italic">
                        {job.category}
                      </span>
                      <span className="text-white font-black italic text-xl shadow-gold-500/20 shadow-2xl">${job.budget}</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-gold-500 transition-colors italic leading-tight uppercase tracking-tighter">
                      {job.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 italic leading-relaxed font-medium">
                      {job.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[8px] text-slate-600 font-black uppercase italic tracking-widest">
                        EST: {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/job/${job.id}`} 
                        className="text-[9px] font-black uppercase tracking-widest text-gold-500 hover:text-white transition-all"
                      >
                        View Project →
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredJobs.length === 0 && (
                  <div className="col-span-full text-center py-32 border border-dashed border-white/5 rounded-[3rem]">
                    <p className="text-slate-600 italic font-black tracking-widest uppercase text-[10px]">
                      No elite opportunities found in this category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;