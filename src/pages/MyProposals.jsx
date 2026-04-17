import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  ExternalLink,
  Search,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProposals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          jobs (
            title,
            budget,
            category,
            client_id
          )
        `)
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setProposals(data);
      setLoading(false);
    };

    fetchMyProposals();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'rejected': return 'text-red-400 border-red-400/20 bg-red-400/5';
      default: return 'text-blue-400 border-blue-400/20 bg-blue-400/5';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pb-20">
        <header className="pt-24 pb-12 px-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            My <span className="text-gold-500">Proposals</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic mt-4">
            Tracking your bids for elite opportunities
          </p>
        </header>

        <main className="px-10 max-w-6xl w-full">
          {loading ? (
            <div className="py-20 text-center font-black italic text-gold-500 animate-pulse uppercase text-[10px] tracking-widest">
              Syncing your bids...
            </div>
          ) : proposals.length > 0 ? (
            <div className="grid gap-6">
              {proposals.map((proposal) => (
                <div 
                  key={proposal.id} 
                  className="group relative bg-white/5 border border-white/5 hover:border-gold-500/30 p-8 rounded-[3rem] transition-all overflow-hidden"
                >
                  {/* Subtle Glow Backdrop */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl group-hover:bg-gold-500/10 transition-all"></div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[8px] font-black uppercase text-gold-500 tracking-[0.3em] italic">
                          {proposal.jobs?.category}
                        </span>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight mt-1 group-hover:text-white transition-colors">
                          {proposal.jobs?.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-slate-500" />
                          <span className="text-sm font-black italic">Bid: ${proposal.bid_amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest italic">
                            {new Date(proposal.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest italic ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/job/${proposal.job_id}`}
                        className="bg-white/5 hover:bg-white hover:text-slate-950 px-6 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center gap-2"
                      >
                        View Project <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Cover Letter Snippet */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-slate-500 text-xs italic leading-relaxed line-clamp-2">
                      <span className="text-slate-400 font-bold uppercase mr-2 tracking-tighter not-italic">Your Pitch:</span>
                      "{proposal.cover_letter}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[4rem]">
              <Search className="mx-auto text-slate-800 mb-6" size={48} />
              <h3 className="text-xl font-black italic uppercase text-slate-500">No proposals found</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 mt-2">
                Start bidding on projects to see them here.
              </p>
              <Link 
                to="/find-jobs" 
                className="inline-block mt-8 text-gold-500 font-black uppercase italic text-[10px] tracking-[0.2em] hover:text-white transition-colors border-b border-gold-500/20"
              >
                Browse Marketplace →
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyProposals;