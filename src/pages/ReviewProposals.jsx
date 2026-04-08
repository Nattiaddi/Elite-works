import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Clock, DollarSign, CheckCircle, XCircle, Mail, Briefcase } from 'lucide-react';

const ReviewProposals = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      // 1. የስራውን መረጃ ማምጣት
      const { data: jobData } = await supabase.from('jobs').select('title').eq('id', jobId).single();
      setJob(jobData);

      // 2. የፕሮፖዛሎችን ዝርዝር ከፍሪላንሰር ፕሮፋይል ጋር ማምጣት
      const { data: proposalsData, error } = await supabase
        .from('proposals')
        .select(`
          *,
          profiles:freelancer_id (full_name, avatar_url)
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (!error) setProposals(proposalsData);
      setLoading(false);
    };

    fetchProposals();
  }, [jobId]);

  const handleAction = async (proposalId, status) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status: status })
      .eq('id', proposalId);

    if (!error) {
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
      alert(`Proposal ${status === 'accepted' ? 'Accepted' : 'Rejected'}!`);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold-500 font-black italic uppercase text-xs tracking-widest">Loading Proposals...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-12 border-l-4 border-gold-500 pl-6">
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
            Review <span className="text-gold-500">Proposals</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest italic mt-2">
            Project: <span className="text-white">{job?.title}</span>
          </p>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-800 rounded-[3rem] p-20 text-center">
            <Briefcase className="w-12 h-12 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">No proposals received yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <div 
                key={proposal.id} 
                className={`group relative bg-slate-900/30 border ${proposal.status === 'accepted' ? 'border-gold-500/50' : 'border-slate-800'} rounded-[2.5rem] p-8 transition-all hover:bg-slate-900/50 overflow-hidden`}
              >
                {/* Status Badge */}
                <div className="absolute top-0 right-10 px-4 py-2 bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl text-[8px] font-black uppercase tracking-widest italic text-gold-500">
                  Status: {proposal.status}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Freelancer Info */}
                  <div className="w-full md:w-1/4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500 flex items-center justify-center text-slate-950 font-black italic text-lg shadow-lg shadow-gold-500/20">
                        {proposal.profiles?.full_name?.charAt(0) || 'F'}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase italic">{proposal.profiles?.full_name || 'Freelancer'}</h3>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Pro Member</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2 text-gold-500 text-[10px] font-black italic">
                        <DollarSign className="w-3 h-3" /> Bid: ${proposal.bid_amount}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black italic">
                        <Clock className="w-3 h-3" /> Delivery: {proposal.delivery_days} Days
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="w-full md:w-2/4">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 italic">Cover Letter</h4>
                    <p className="text-slate-300 text-xs leading-relaxed font-medium italic bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
                      {proposal.cover_letter}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-1/4 flex flex-col gap-3">
                    <button 
                      onClick={() => navigate('/messages')}
                      className="w-full flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-gold-500/50 transition-all italic"
                    >
                      <Mail className="w-3 h-3 text-gold-500" /> Chat Now
                    </button>
                    
                    {proposal.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(proposal.id, 'accepted')}
                          className="flex-1 flex items-center justify-center gap-2 bg-gold-500 text-slate-950 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold-500/10"
                        >
                          <CheckCircle className="w-3 h-3" /> Hire
                        </button>
                        <button 
                          onClick={() => handleAction(proposal.id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-red-500 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
                        >
                          <XCircle className="w-3 h-3" /> Decline
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewProposals;