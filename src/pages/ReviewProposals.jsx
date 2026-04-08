import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ReviewProposals = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      // 1. የስራውን ዝርዝር ማምጣት
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      setJob(jobData);

      // 2. ለዚህ ስራ የመጡ ፕሮፖዛሎችን ከፍሪላንሰር ፕሮፋይል ጋር ማምጣት
      const { data: proposalData, error } = await supabase
        .from('proposals')
        .select(`
          *,
          profiles!proposals_freelancer_id_fkey (
            id,
            full_name,
            title,
            avatar_url
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (!error) setProposals(proposalData);
      setLoading(false);
    };

    fetchProposals();
  }, [jobId]);

  const handleHire = async (proposal) => {
    const confirmHire = window.confirm(`Are you sure you want to hire ${proposal.profiles.full_name}?`);
    if (!confirmHire) return;

    // እዚህ ጋር ወደ ክፍያ (Escrow) ገጽ እንመራዋለን
    navigate(`/checkout/${proposal.id}`, { state: { proposal, job } });
  };

  if (loading) return <div className="text-gold-500 text-center py-20 italic font-black uppercase tracking-widest animate-pulse">Scanning Elite Proposals...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-slate-800 pb-8">
        <p className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Reviewing Proposals For</p>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{job?.title}</h1>
      </div>

      <div className="space-y-6">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <div key={proposal.id} className="bg-slate-900/40 border border-slate-800 hover:border-gold-500/50 rounded-[2.5rem] p-8 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                
                {/* Freelancer Info */}
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-full border-2 border-gold-500 p-1 flex-shrink-0">
                    <img 
                      src={proposal.profiles.avatar_url || 'https://via.placeholder.com/100'} 
                      className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      alt="Freelancer"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic">{proposal.profiles.full_name}</h3>
                    <p className="text-gold-500 text-[10px] font-bold uppercase tracking-widest mb-4">{proposal.profiles.title}</p>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-xl">
                      <p className="text-slate-400 text-sm italic leading-relaxed">{proposal.cover_letter}</p>
                    </div>
                  </div>
                </div>

                {/* Bid Info & Action */}
                <div className="text-right flex flex-col justify-between items-end min-w-[150px]">
                  <div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Freelancer Bid</p>
                    <p className="text-3xl font-black text-white italic">${proposal.bid_amount}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleHire(proposal)}
                    className="bg-gold-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-lg shadow-gold-500/10"
                  >
                    Hire Candidate
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
            <p className="text-slate-600 font-black italic uppercase text-xs tracking-widest">No proposals received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewProposals;