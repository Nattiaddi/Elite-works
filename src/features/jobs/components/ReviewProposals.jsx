import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';
import { User, DollarSign, FileText, CheckCircle } from 'lucide-react';

const ReviewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      const user = (await supabase.auth.getUser()).data.user;

      // እዚህ ጋር ደንበኛው የራሱን ስራዎች ብቻ ማመልከቻ እንዲያይ እናደርጋለን
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          jobs!inner(title, client_id),
          profiles:freelancer_id(full_name, avatar_url, bio)
        `)
        .eq('jobs.client_id', user.id);

      if (!error) setProposals(data);
      setLoading(false);
    };

    fetchProposals();
  }, []);

  const acceptProposal = async (proposalId) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposalId);

    if (!error) {
      alert("Elite Professional Hired!");
      // ዝርዝሩን እንደገና እንዲያድስ ማድረግ ይቻላል
    }
  };

  if (loading) return <div className="text-gold p-10 text-center">Fetching Elite Applicants...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-white">Review Proposals</h1>
        <p className="text-gray-500">Manage applicants for your active job postings.</p>
      </header>

      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <div className="bg-obsidian-soft p-20 text-center rounded-3xl border border-white/5">
            <p className="text-gray-500 italic">No proposals received yet.</p>
          </div>
        ) : (
          proposals.map((prop) => (
            <div key={prop.id} className="bg-obsidian-soft border border-white/5 rounded-3xl p-8 hover:border-gold/20 transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                {/* Applicant Info */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{prop.profiles.full_name}</h3>
                    <p className="text-gold text-sm font-medium mb-2">Applied for: {prop.jobs.title}</p>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1"><DollarSign size={14}/> Bid: ${prop.bid_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-3">
                  <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all">
                    View Profile
                  </button>
                  <button 
                    onClick={() => acceptProposal(prop.id)}
                    className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-dark transition-all"
                  >
                    <CheckCircle size={18} /> Hire Now
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-xs text-gray-500 uppercase font-black mb-3 flex items-center gap-2">
                  <FileText size={14} /> Cover Letter
                </h4>
                <p className="text-gray-400 leading-relaxed italic">"{prop.cover_letter}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewProposals;