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
    <div className="max-w-7xl mx-auto px-6 py-12 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-black italic text-white mb-2">
          Find Your Next <span className="text-gold-500 drop-shadow-sm">Masterpiece</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Premium opportunities for top-tier professionals.</p>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-gold-500 font-black italic animate-pulse tracking-widest uppercase text-xs">
            Loading Elite Projects...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="group relative bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2rem] hover:border-gold-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.05)]">
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold-500 bg-gold-500/5 border border-gold-500/10 px-3 py-1 rounded-lg">
                  {job.category || 'Premium'}
                </span>
                <span className="text-white font-black italic text-lg">${job.budget}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-500 transition-colors leading-tight">
                {job.title}
              </h3>
              
              <p className="text-slate-400 text-sm line-clamp-3 mb-8 italic leading-relaxed">
                {job.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
                <Link 
                  to={`/job/${job.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-white border-b border-gold-500/0 hover:border-gold-500 hover:text-gold-500 transition-all pb-1"
                >
                  View Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="text-center py-32 border border-dashed border-slate-900 rounded-[3rem]">
          <p className="text-slate-600 italic font-bold tracking-widest uppercase text-xs">
            No premium jobs available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default FindJobs;