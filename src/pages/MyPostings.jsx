import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const MyPostings = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [proposals, setProposals] = useState({}); // ስራዎቹ ላይ የመጡ ማመልከቻዎች
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyContent = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // 1. የኔን ስራዎች ማምጣት
      const { data: jobs, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (jobs) {
        setMyJobs(jobs);
        
        // 2. ለእያንዳንዱ ስራ የመጡ ማመልከቻዎችን ማምጣት
        const { data: allProposals, error: propError } = await supabase
          .from('proposals')
          .select('*')
          .in('job_id', jobs.map(j => j.id));

        if (allProposals) {
          // ማመልከቻዎቹን በ Job ID ግሩፕ ማድረግ
          const grouped = allProposals.reduce((acc, prop) => {
            if (!acc[prop.job_id]) acc[prop.job_id] = [];
            acc[prop.job_id].push(prop);
            return acc;
          }, {});
          setProposals(grouped);
        }
      }
      setLoading(false);
    };

    fetchMyContent();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black italic animate-pulse">FETCHING YOUR ELITE POSTS...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">My <span className="text-gold-500">Postings</span></h1>
            <p className="text-slate-500 text-sm font-medium italic mt-2">Manage your listings and review top talent proposals.</p>
          </div>
          <Link to="/post-job" className="bg-gold-500 text-slate-950 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">
            Post New Job
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-500 font-bold italic">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {myJobs.map((job) => (
              <div key={job.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                {/* Job Header */}
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                  <div>
                    <h2 className="text-xl font-black text-white italic mb-1">{job.title}</h2>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      Budget: <span className="text-gold-500">{job.budget} ETB</span> • {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-xl">
                    <span className="text-gold-500 font-black text-xs uppercase italic">
                      {proposals[job.id]?.length || 0} Proposals
                    </span>
                  </div>
                </div>

                {/* Proposals List */}
                <div className="p-8 space-y-6">
                  {proposals[job.id]?.length > 0 ? (
                    proposals[job.id].map((prop) => (
                      <div key={prop.id} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 hover:border-gold-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-gold-500 italic uppercase tracking-tighter">{prop.freelancer_name}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bid: {prop.bid_amount} ETB</p>
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-gold-500 hover:text-slate-950 transition-all">
                            View Portfolio
                          </button>
                        </div>
                        <p className="text-slate-400 text-sm italic leading-relaxed">
                          "{prop.cover_letter}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 text-xs italic font-medium">No proposals yet. High-quality talent will apply soon!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostings;