import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const FindJobs = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Apply States
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // ስራዎችን ከ Supabase ማምጣት
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching jobs:", error);
      else setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // ማመልከቻ መላክ
  const handleApply = async (e) => {
    e.preventDefault();
    setIsApplying(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to apply!");
      setIsApplying(false);
      return;
    }

    const { error } = await supabase.from('proposals').insert([
      {
        job_id: selectedJob.id,
        freelancer_id: user.id,
        freelancer_name: user.user_metadata?.full_name || 'Elite Freelancer',
        cover_letter: coverLetter,
        bid_amount: parseInt(bidAmount),
      }
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Application sent successfully! 🚀");
      setSelectedJob(null);
      setCoverLetter('');
      setBidAmount('');
    }
    setIsApplying(false);
  };

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
          {/* Sidebar */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl sticky top-28">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500 mb-6 italic">Quick Filters</h3>
              <div className="space-y-4 text-sm font-bold text-slate-400">
                <p className="hover:text-gold-400 cursor-pointer transition-colors italic">All Categories</p>
                <p className="hover:text-gold-400 cursor-pointer transition-colors italic">Web Development</p>
                <p className="hover:text-gold-400 cursor-pointer transition-colors italic">Graphic Design</p>
              </div>
            </div>
          </aside>

          {/* Job List */}
          <main className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-20 text-gold-500 font-black animate-pulse tracking-widest uppercase italic">Loading...</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-slate-900/30 border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-gold-500/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-[50px] rounded-full group-hover:bg-gold-500/10 transition-all"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h2 className="text-2xl font-black text-white group-hover:text-gold-400 transition-colors mb-2 italic">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                        <span className="text-gold-500/80 italic">Verified Client: {job.client_name}</span>
                        <span>•</span>
                        <span>{job.experience_level}</span>
                        <span>•</span>
                        <span>{job.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-2xl line-clamp-2">{job.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white">{job.budget?.toLocaleString()} <span className="text-xs font-normal opacity-50">ETB</span></p>
                      <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 italic">Budget</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 relative z-10">
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-[10px] uppercase hover:bg-gold-500 transition-all shadow-lg active:scale-95 tracking-widest"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] max-w-xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
            
            <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-8 text-slate-500 hover:text-white font-bold transition-colors">CLOSE [X]</button>
            
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter">Apply for <span className="text-gold-500">{selectedJob.title}</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 italic">To: {selectedJob.client_name}</p>

            <form onSubmit={handleApply} className="space-y-8 relative z-10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Cover Letter</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white focus:border-gold-500/50 outline-none transition-all text-sm font-medium"
                  placeholder="Explain why you're the best fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Your Bid (ETB)</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white focus:border-gold-500/50 outline-none transition-all font-black text-xl"
                  placeholder="0.00"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <button 
                disabled={isApplying}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:shadow-gold-500/20 hover:shadow-2xl transition-all disabled:opacity-50 active:scale-95"
              >
                {isApplying ? 'Processing Elite Proposal...' : 'Submit Elite Proposal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindJobs;