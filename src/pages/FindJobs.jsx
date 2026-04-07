import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Jobs');

  const categories = ['All Jobs', 'Web Development', 'UI/UX Design', 'Logo Design', 'Content Writing'];

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

  // መፈለጊያ እና ማጣሪያ ተግባር (Search & Filter Logic)
  useEffect(() => {
    let result = jobs;

    if (activeCategory !== 'All Jobs') {
      result = result.filter(job => job.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, activeCategory, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-slate-950 min-h-screen">
      {/* Header & Search Bar */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
            Find Your Next <span className="text-gold-500">Masterpiece</span>
          </h2>
          <p className="text-slate-500 font-medium italic">Premium opportunities for top-tier professionals.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search jobs (e.g. Website, Logo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-gold-500 outline-none transition-all italic text-sm"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic ${
              activeCategory === cat 
              ? 'bg-gold-500 border-gold-500 text-slate-950 shadow-lg shadow-gold-500/20' 
              : 'border-slate-800 text-slate-500 hover:border-gold-500 hover:text-gold-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-xs">
          Searching Elite Database...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div key={job.id} className="group relative bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2rem] hover:border-gold-500/40 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold-500 bg-gold-500/5 border border-gold-500/10 px-3 py-1 rounded-lg italic">
                    {job.category}
                  </span>
                  <span className="text-white font-black italic text-lg">${job.budget}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-500 transition-colors leading-tight italic">
                  {job.title}
                </h3>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-8 italic leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/job/${job.id}`} 
                    className="text-[10px] font-black uppercase tracking-widest text-white border-b border-gold-500 hover:text-gold-500 transition-all pb-1"
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-32 border border-dashed border-slate-900 rounded-[3rem]">
              <p className="text-slate-600 italic font-bold tracking-widest uppercase text-xs">
                No jobs found matching "{searchTerm}" in {activeCategory}.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindJobs;