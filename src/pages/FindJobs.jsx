import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const FindJobs = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ስራዎችን ከ Supabase ለማምጣት (Fetch)
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false }); // አዳዲስ ስራዎች ከላይ እንዲሆኑ

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 selection:bg-gold-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            Find <span className="text-gold-500">Elite Work</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Explore the latest opportunities from prestigious clients.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* Sidebar Filters (Static for now) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl sticky top-28">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-6 italic">Quick Filters</h3>
              <div className="space-y-4 text-sm font-bold text-slate-400">
                <p className="hover:text-gold-400 cursor-pointer transition-colors">All Categories</p>
                <p className="hover:text-gold-400 cursor-pointer transition-colors">Web Development</p>
                <p className="hover:text-gold-400 cursor-pointer transition-colors">Graphic Design</p>
                <p className="hover:text-gold-400 cursor-pointer transition-colors">Digital Marketing</p>
              </div>
            </div>
          </aside>

          {/* Main Content: Real Job List */}
          <main className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-20 text-gold-500 font-black animate-pulse tracking-widest uppercase">
                Loading Opportunities...
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
                <p className="text-slate-500 font-bold uppercase tracking-widest">No jobs found yet. Be the first to post!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-gold-500/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-[50px] rounded-full group-hover:bg-gold-500/10 transition-all"></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h2 className="text-2xl font-black text-white group-hover:text-gold-400 transition-colors mb-2 italic">
                        {job.title}
                      </h2>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                        <span className="text-gold-500/80 italic">Verified Client: {job.client_name}</span>
                        <span>•</span>
                        <span>{job.experience_level}</span>
                        <span>•</span>
                        <span>{job.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white">{job.budget?.toLocaleString()} <span className="text-xs font-normal opacity-50">ETB</span></p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 italic">Budget</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 relative z-10">
                     <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                       Posted {new Date(job.created_at).toLocaleDateString()}
                     </span>
                     <button className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-[10px] uppercase hover:bg-gold-500 transition-all shadow-lg active:scale-95 tracking-widest">
                       View Details
                     </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;