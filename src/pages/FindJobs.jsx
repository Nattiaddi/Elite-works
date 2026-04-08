import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { categories as categoryData } from '../constants/categories'; // ስሙ እንዳይደገም categoryData አልነው

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
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
    fetchJobs();
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
    <div className="max-w-7xl mx-auto px-6 py-12 bg-slate-950 min-h-screen">
      
      {/* Header & Search Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
            Find Your Next <span className="text-gold-500">Masterpiece</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Premium opportunities for top-tier professionals.</p>
        </div>

        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search jobs (e.g. AI, Design)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filter */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-[2.5rem] sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black uppercase tracking-tighter text-lg italic">Filters</h3>
              {(activeCategory !== 'All' || activeSubCategory !== 'All') && (
                <button 
                  onClick={() => { setActiveCategory('All'); setActiveSubCategory('All'); }}
                  className="text-gold-500 text-[10px] font-black uppercase hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
              {categoryData.map((cat) => (
                <div key={cat.id} className="group">
                  <button 
                    onClick={() => { setActiveCategory(cat.name); setActiveSubCategory('All'); }}
                    className={`flex items-center gap-3 w-full text-left font-black uppercase tracking-widest text-[11px] mb-3 transition-all ${activeCategory === cat.name ? 'text-gold-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <cat.icon size={16} className={activeCategory === cat.name ? 'text-gold-500' : 'text-slate-600'} />
                    {cat.name}
                  </button>
                  
                  {activeCategory === cat.name && (
                    <ul className="pl-7 space-y-2 mb-4 border-l border-gold-500/20 ml-2 animate-in slide-in-from-left-2 duration-300">
                      {cat.subCategories.map((sub) => (
                        <li key={sub}>
                          <button 
                            onClick={() => setActiveSubCategory(sub)}
                            className={`text-[10px] block w-full text-left font-bold transition-all ${activeSubCategory === sub ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            • {sub}
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
            <div className="flex justify-center py-20 text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-xs">
              Accessing Elite Database...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="group relative bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-gold-500/40 transition-all duration-500 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold-500 bg-gold-500/5 border border-gold-500/10 px-3 py-1 rounded-lg italic inline-block">
                          {job.category}
                        </span>
                        {job.sub_category && (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 px-3 italic">
                            {job.sub_category}
                          </span>
                        )}
                      </div>
                      <span className="text-white font-black italic text-xl">${job.budget}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-500 transition-colors leading-tight italic">
                      {job.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm line-clamp-3 mb-8 italic leading-relaxed flex-grow">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">
                        Posted: {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/job/${job.id}`} 
                        className="text-[10px] font-black uppercase tracking-widest text-white border-b border-gold-500 hover:text-gold-500 transition-all pb-1"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-32 border border-dashed border-slate-900 rounded-[3rem]">
                  <p className="text-slate-600 italic font-bold tracking-widest uppercase text-xs">
                    No elite opportunities found in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;