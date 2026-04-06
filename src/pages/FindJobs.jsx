import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching jobs:', error);
      else setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="mb-12">
        <h2 className="text-4xl font-black italic text-white mb-2">
          Find Your Next <span className="text-gold-500 text-shadow-gold">Masterpiece</span>
        </h2>
        <p className="text-slate-400 font-medium italic">Browse through premium opportunities curated for elite talent.</p>
      </div>

      {/* Filters (Placeholder) */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-4">
        {['All Jobs', 'Web Dev', 'Design', 'Marketing', 'Video'].map((cat) => (
          <button key={cat} className="px-6 py-2 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-gold-500 hover:text-gold-500 transition-all whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="text-gold-500 font-black italic animate-pulse">Loading Elite Opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-gold-500/50 transition-all hover:shadow-2xl hover:shadow-gold-500/5">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-gold-500 bg-gold-500/10 px-3 py-1 rounded-md">
                  {job.category || 'Freelance'}
                </span>
                <span className="text-white font-black italic">${job.budget}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-500 transition-colors">
                {job.title}
              </h3>
              
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 italic">
                {job.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
                <Link 
                  to={`/job/${job.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-gold-500 transition-all"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500 italic font-bold">No jobs found. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default FindJobs;